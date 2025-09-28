import { useEffect, useRef, useState } from 'react'

function ChatInterface() {
  const mediaRecorderRef = useRef(null)
  const [permission, setPermission] = useState('idle')
  const [recording, setRecording] = useState(false)
  const [chunks, setChunks] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lang, setLang] = useState('id')
  const [task, setTask] = useState('transcribe')
  const audioRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => setPermission('granted'))
      .catch(() => setPermission('denied'))
  }, [])

  const startRecording = async () => {
    setError('')
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
    const clickTs = performance.now()
    
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
      const transcript = data.text || ''
      const transcriptMs = data.transcript_ms || 0

      // Add user message to conversation
      const userMessage = {
        id: Date.now(),
        type: 'user',
        text: transcript,
        timestamp: Date.now(),
        processingTime: transcriptMs
      }
      setConversations(prev => [...prev, userMessage])

      if (data.job_id) {
        // Start polling for LLM reply
        const poll = async () => {
          try {
            const r = await fetch(`http://127.0.0.1:5000/reply/${data.job_id}`)
            const j = await r.json()
            if (j.status === 'done' || j.status === 'error' || j.status === 'unavailable') {
              const plain = j.reply_plain
              const safeText = typeof j.reply === 'string' ? j.reply : (j.reply ? JSON.stringify(j.reply) : '')
              const replyText = plain || safeText
              const replyMs = j.llm_ms || 0

              // Add LLM message to conversation
              const llmMessage = {
                id: Date.now() + 1,
                type: 'llm',
                text: replyText,
                timestamp: Date.now(),
                processingTime: replyMs,
                audioUrl: null
              }
              setConversations(prev => [...prev, llmMessage])
              return
            }
            setTimeout(poll, 600)
          } catch {
            setTimeout(poll, 1000)
          }
        }
        poll()
      }
    } catch (err) {
      setError(err.message || 'Gagal transcribe')
    } finally {
      setLoading(false)
    }
  }

  const playTTS = async (text, messageId) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.error || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      
      // Update conversation with audio URL
      setConversations(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, audioUrl: url } : msg
      ))
      
      // Play audio
      const audio = new Audio(url)
      audio.play()
    } catch (err) {
      setError(err.message || 'Gagal memutar audio')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-xl font-semibold text-center">English Conversation Practice</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex">
        {/* LLM Section */}
        <div className="flex-1 p-4  ">
          <h2 className="text-lg font-medium mb-4 text-center">LLM</h2>
          <div className="space-y-4">
            {conversations.filter(msg => msg.type === 'llm').map((message) => (
              <div key={message.id} className="flex justify-start">
                <div className="max-w-xs">
                  <div className="text-xs text-gray-500 mb-1 text-center">
                    {message.processingTime}ms
                  </div>
                  <div className="bg-pink-100 rounded-lg p-3 relative">
                    <p className="text-sm">{message.text}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => playTTS(message.text, message.id)}
                        className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                      >
                        Speak
                      </button>
                      {message.audioUrl && (
                        <audio controls className="h-8 text-xs">
                          <source src={message.audioUrl} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Microphone */}
        <div className="flex flex-col items-center justify-around px-4 ">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={permission !== 'granted'}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all ${
              recording 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-yellow-400 hover:bg-yellow-500'
            } ${permission !== 'granted' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          {recording && (
            <p className="text-sm text-gray-600 mt-2">Recording...</p>
          )}
          <div className=' bg-gray-600 h-100 w-0.5 '>
            
          </div>
        </div>

        {/* YOU Section */}
        <div className="flex-1 p-4">
          <h2 className="text-lg font-medium mb-4 text-center">YOU</h2>
          <div className="space-y-4">
            {conversations.filter(msg => msg.type === 'user').map((message) => (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-xs">
                  <div className="text-xs text-gray-500 mb-1 text-center">
                    {message.processingTime}ms
                  </div>
                  <div className="bg-gray-800 text-white rounded-lg p-3">
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={uploadAndTranscribe}
            disabled={chunks.length === 0 || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send'}
          </button>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Language:</label>
            <select 
              className="border px-2 py-1 rounded text-sm" 
              value={lang} 
              onChange={e => setLang(e.target.value)}
            >
              <option value="id">Indonesian</option>
              <option value="en">English</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Task:</label>
            <select 
              className="border px-2 py-1 rounded text-sm" 
              value={task} 
              onChange={e => setTask(e.target.value)}
            >
              <option value="transcribe">Transcribe</option>
              <option value="translate">Translate</option>
            </select>
          </div>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm text-center mt-2">{error}</p>
        )}
        
        {permission === 'denied' && (
          <p className="text-red-600 text-sm text-center mt-2">
            Please allow microphone access in your browser.
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatInterface
