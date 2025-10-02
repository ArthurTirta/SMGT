import os
import tempfile
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import whisper
from dotenv import load_dotenv
import json
from openai import OpenAI
import threading
import time
import uuid
from pydantic import BaseModel
from typing import List
import requests
import re


app = Flask(__name__)
CORS(app)

# Load env and initialize clients once
load_dotenv(override=True)

def clean_emotions(text: str) -> str:
    # hapus teks dalam [ ... ]
    return re.sub(r"\[.*?\]\s*", "", text).strip()

class CorrectionItem(BaseModel):
    sentence_contain_wrong: str
    sentence_correct: str
    additional_sentence: str


class format_answer_llm(BaseModel):
    is_wrong: bool
    corrections: List[CorrectionItem]
    



# Whisper model
WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "small")
model = whisper.load_model(WHISPER_MODEL_NAME)

# LLM client (Gemini via OpenAI-compatible endpoint)
API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
llm_client = OpenAI(base_url=GEMINI_BASE_URL, api_key=API_KEY) if API_KEY else None

# ElevenLabs config
ELEVEN_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVEN_VOICE_ID = os.getenv("ELEVEN_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Rachel default

# In-memory store for async LLM jobs
JOBS = {}


@app.get("/health")
def health_check():
    return jsonify({"status": "ok", "model": WHISPER_MODEL_NAME})


@app.post("/transcribe")
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "Missing 'audio' file in form-data"}), 400

    audio_file = request.files["audio"]
    if audio_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save to a temporary file with a proper extension if available
    suffix = os.path.splitext(audio_file.filename)[1] or ".webm"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        temp_path = tmp.name
        audio_file.save(temp_path)

    try:
        t0 = time.time()
        # Allow client to force language to avoid inconsistent autodetect
        # Default to Indonesian (id) if not provided
        language = request.form.get("language") or "id"
        task = request.form.get("task") or "transcribe"  # transcribe | translate
        initial_prompt = request.form.get("initial_prompt") or None

        # fp16 only on CUDA
        use_fp16 = getattr(model, 'device', None) and getattr(model.device, 'type', '') != 'cpu'

        # Use Whisper's high-level API; ffmpeg must be installed on the system
        result = model.transcribe(
            temp_path,
            language=language,
            task=task,
            temperature=0,
            initial_prompt=initial_prompt,
            fp16=use_fp16,
        )
        text = result.get("text", "").strip()
        detected = result.get("language")
        transcript_ms = int((time.time() - t0) * 1000)

        # Spawn async LLM job so we can return immediately
        job_id = str(uuid.uuid4())
        JOBS[job_id] = {
            "status": "pending",
            "created_at": time.time(),
            "text": text,
            "reply": None,
            "reply_plain": None,
            "llm_ms": None,
        }

        def run_llm(job_key: str, transcript_text: str):
            if not llm_client or not transcript_text:
                JOBS[job_key]["status"] = "unavailable"
                return
            try:
                llm_t0 = time.time()
                system_prompt = (
                    "#Personality:You-are-a-British-English-language-tutor-named-Arthur."
                    "You-are-patient,-encouraging,-and-have-a-clear-Received-Pronunciation-(RP)-accent."
                    "You-are-knowledgeable-about-various-aspects-of-British-culture-and-can-explain-nuances-in-the-language."
                    "You-are-enthusiastic-about-helping-Indonesian-students-improve-their-English-speaking-skills."
                    "#Environment:You-are-engaging-with-an-Indonesian-student-over-a-voice-call."
                    "The-student-is-learning-English-to-improve-their-communication-skills-for-personal-or-professional-reasons."
                    "The-student-may-have-varying-levels-of-English-proficiency,-from-beginner-to-intermediate."
                    "The-student-may-ask-questions-about-grammar,-vocabulary,-pronunciation,-or-cultural-context."
                    "#Tone:Your-responses-are-clear,-friendly,-and-supportive."
                    "You-speak-at-a-moderate-pace,-enunciating-clearly-to-aid-comprehension."
                    "You-use-a-variety-of-teaching-techniques,-including-repetition,-explanation,-and-examples."
                    "You-provide-constructive-feedback-and-positive-reinforcement-to-encourage-the-student."
                    "You-incorporate-elements-of-British-humor-and-culture-to-make-the-learning-experience-engaging."
                    "#Goal:Help-Indonesian-students-improve-their-English-speaking-skills-by-prioritising-conversation."
                    "#Output-Format:Return-concise-JSON-only-with-fields:"
                    "is_wrong(boolean), corrections(array-of-objects-with-fields: sentence_contain_wrong, sentence_correct, additional_sentence, emotion_text)."
                    "The field `emotion_text` is a natural English correction formatted for TTS, with emotional cues like [smiling], [serious], [encouraging], [gentle], etc."
                    "Each correction should be one or two sentences, natural and supportive, ready to be read aloud."
                    "Keep-answers-very-short: identify-up-to-3-incorrect-or-unnatural-sentences, provide-corrected-versions,"
                    "and-for-each-add-one-brief-extra-sentence-(max-12-words)-as-a-tip-or-context."
                    "If-no-issues, set is_wrong=false and corrections=[]."
                )
                messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": transcript_text}]
                completion = llm_client.chat.completions.parse(
                    model=os.getenv("LLM_MODEL", "gemini-2.5-flash-preview-05-20"),
                    messages=messages,
                    response_format=format_answer_llm,
                )
                parsed = getattr(completion.choices[0].message, "parsed", None)
                content = completion.choices[0].message.content

                # Prefer parsed object (structured), fallback to content text
                if parsed is not None:
                    try:
                        data = parsed.model_dump()  # pydantic -> dict
                    except Exception:
                        # In case parsed is already a dict-like
                        data = dict(parsed)

                    # Build a concise natural-language string for TTS
                    if not data.get("is_wrong") or not data.get("corrections"):
                        plain = "[cheerful] No big problems! Keep going, you're doing really well."
                    else:
                        lines = []
                        for idx, item in enumerate(data.get("corrections", [])[:3], start=1):
                            emotion_text = item.get("emotion_text") or ""
                            if emotion_text:
                                lines.append(emotion_text)
                            else:
                                # fallback
                                correct = item.get("sentence_correct", "")
                                tip = item.get("additional_sentence", "")
                                lines.append(f"[gentle] Instead, try: '{correct}'. {tip}")
                        plain = " ".join(lines)

                    JOBS[job_key]["reply"] = data
                    JOBS[job_key]["reply_plain"] = plain
                else:
                    # If no structured parse, return the raw text and mirror it to plain
                    JOBS[job_key]["reply"] = content
                    JOBS[job_key]["reply_plain"] = content
                JOBS[job_key]["llm_ms"] = int((time.time() - llm_t0) * 1000)
                JOBS[job_key]["status"] = "done"
            except Exception as exc:
                JOBS[job_key]["reply"] = f"LLM error: {exc}"
                JOBS[job_key]["status"] = "error"

        threading.Thread(target=run_llm, args=(job_id, text), daemon=True).start()

        return jsonify({
            "text": text,
            "language": detected or language,
            "job_id": job_id,
            "transcript_ms": transcript_ms,
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    finally:
        try:
            os.remove(temp_path)
        except Exception:
            pass


@app.get("/reply/<job_id>")
def get_reply(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"error": "job not found"}), 404
    return jsonify({
        "status": job["status"],
        "reply": job["reply"],
        "reply_plain": job.get("reply_plain"),
        "llm_ms": job["llm_ms"],
    })


@app.post("/tts")
def synthesize_tts():
    if not ELEVEN_API_KEY:
        return jsonify({"error": "ELEVEN_API_KEY not set"}), 500
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    voice_id = data.get("voice_id") or ELEVEN_VOICE_ID
    if not text:
        return jsonify({"error": "Missing text"}), 400

    # 🔥 bersihkan text dari [gentle], [encouraging], dll
    text = clean_emotions(text)

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "accept": "audio/mpeg",
        "content-type": "application/json",
    }
    payload = {
        "text": text,
        # Optionally set a model and voice settings
        # "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        if r.status_code != 200:
            return jsonify({"error": f"TTS failed: HTTP {r.status_code} - {r.text[:200]}"}), 500
        return Response(r.content, mimetype="audio/mpeg")
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

if __name__ == "__main__":
    # Run development server: http://127.0.0.1:5000
    app.run(host="127.0.0.1", port=5000, debug=True)