import { useEffect, useRef, useState } from 'react'

function MicTranscriber() {
  const mediaRecorderRef = useRef(null)
  const [permission, setPermission] = useState('idle') // idle | granted | denied
  const [recording, setRecording] = useState(false)
  const [chunks, setChunks] = useState([])
  const [transcript, setTranscript] = useState('')
  const [lang, setLang] = useState('id')
  const [task, setTask] = useState('transcribe')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // request mic permission on mount
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => setPermission('granted'))
      .catch(() => setPermission('denied'))
  }, [])

  const startRecording = async () => {
    setError('')
    setTranscript('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      setChunks([])

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setChunks(prev => [...prev, e.data])
        }
      }

      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
      }

      mr.start()
      setRecording(true)
    } catch (err) {
      setError('Tidak bisa mengakses mikrofon')
    }
  }

  const stopRecording = () => {
    const mr = mediaRecorderRef.current
    if (mr && mr.state !== 'inactive') {
      mr.stop()
    }
    setRecording(false)
  }

  const uploadAndTranscribe = async () => {
    setLoading(true)
    setError('')
    try {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const form = new FormData()
      form.append('audio', blob, 'audio.webm')
      form.append('language', lang)
      form.append('task', task)

      const res = await fetch('http://127.0.0.1:5000/transcribe', {
        method: 'POST',
        body: form
      })

      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      setTranscript(data.text || '')
    } catch (err) {
      setError(err.message || 'Gagal transcribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='w-full max-w-2xl mx-auto p-4'>
      <h2 className='text-xl font-semibold mb-2'>Mic to Whisper (Local)</h2>
      <div className='flex items-center gap-3 mb-3'>
        <label className='text-sm'>Language:</label>
        <select className='border px-2 py-1 rounded' value={lang} onChange={e => setLang(e.target.value)}>
          <option value="id">Indonesian (id)</option>
          <option value="en">English (en)</option>
          <option value="auto">Auto-detect (auto)</option>
        </select>
        <label className='text-sm ml-4'>Task:</label>
        <select className='border px-2 py-1 rounded' value={task} onChange={e => setTask(e.target.value)}>
          <option value="transcribe">Transcribe</option>
          <option value="translate">Translate to English</option>
        </select>
      </div>
      <div className='flex items-center gap-2 mb-3'>
        <button
          className={`px-3 py-2 rounded ${recording ? 'bg-gray-400' : 'bg-green-600 text-white'}`}
          onClick={startRecording}
          disabled={recording || permission !== 'granted'}
        >
          Start
        </button>
        <button
          className={`px-3 py-2 rounded ${!recording ? 'bg-gray-400' : 'bg-yellow-600 text-white'}`}
          onClick={stopRecording}
          disabled={!recording}
        >
          Stop
        </button>
        <button
          className='px-3 py-2 rounded bg-blue-600 text-white'
          onClick={uploadAndTranscribe}
          disabled={chunks.length === 0 || loading}
        >
          {loading ? 'Transcribing...' : 'Upload & Transcribe'}
        </button>
      </div>
      {permission === 'denied' && (
        <p className='text-red-600 text-sm'>Izinkan akses mikrofon di browser Anda.</p>
      )}
      {error && (
        <p className='text-red-600 text-sm'>{error}</p>
      )}
      {transcript && (
        <div className='mt-3 p-3 rounded border'>
          <div className='text-sm text-gray-600 mb-1'>Transcript:</div>
          <p>{transcript}</p>
        </div>
      )}
    </section>
  )
}

export default MicTranscriber


