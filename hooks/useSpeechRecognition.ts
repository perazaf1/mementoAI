'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface SpeechRecognitionState {
  isSupported: boolean
  isListening: boolean
  transcript: string
  interimTranscript: string
  start: () => void
  stop: () => void
  getFullTranscript: () => string
}

export function useSpeechRecognition(): SpeechRecognitionState {
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalRef = useRef('')

  useEffect(() => {
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as Window & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition

    if (!SpeechRecognition) return
    setIsSupported(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'fr-FR'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalRef.current += result[0].transcript + ' '
          setTranscript(finalRef.current)
        } else {
          interim += result[0].transcript
        }
      }
      setInterimTranscript(interim)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    finalRef.current = ''
    setTranscript('')
    setInterimTranscript('')
    recognitionRef.current.start()
    setIsListening(true)
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  // Lit directement la ref (synchrone) — évite le délai de mise à jour React
  const getFullTranscript = useCallback(() => {
    return finalRef.current.trim()
  }, [])

  return { isSupported, isListening, transcript, interimTranscript, start, stop, getFullTranscript }
}
