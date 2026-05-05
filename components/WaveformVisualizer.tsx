'use client'

import { useEffect, useRef } from 'react'

export default function WaveformVisualizer({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const phaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const bars = 48
      const barWidth = (width / bars) * 0.6
      const gap = width / bars

      for (let i = 0; i < bars; i++) {
        const x = i * gap + gap / 2 - barWidth / 2
        const noise = isActive
          ? Math.abs(Math.sin(phaseRef.current + i * 0.4) * Math.sin(phaseRef.current * 0.7 + i * 0.2))
          : 0.05
        const barHeight = Math.max(4, noise * height * 0.85)
        const y = (height - barHeight) / 2

        const alpha = isActive ? 0.6 + noise * 0.4 : 0.2
        ctx.fillStyle = `rgba(212, 168, 83, ${alpha})`
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 2)
        ctx.fill()
      }

      if (isActive) phaseRef.current += 0.08
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [isActive])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      className="w-full max-w-sm mx-auto"
    />
  )
}
