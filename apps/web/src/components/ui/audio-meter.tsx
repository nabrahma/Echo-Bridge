'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

interface AudioMeterProps {
  stream: MediaStream | null
  className?: string
  barCount?: number
  active?: boolean
}

/**
 * AudioMeter — real-time audio level visualizer using Web Audio API analyser.
 * Renders as animated vertical bars that respond to actual audio amplitude.
 */
export function AudioMeter({
  stream,
  className,
  barCount = 20,
  active = false,
}: AudioMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return

    // No stream — render idle bars
    if (!stream || !active) {
      const drawIdle = () => {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height)
        const barW = canvas.width / barCount
        const gap = 2
        for (let i = 0; i < barCount; i++) {
          const h = canvas.height * 0.08
          ctx2d.fillStyle = 'rgba(255, 215, 0, 0.2)'
          ctx2d.fillRect(i * barW + gap / 2, canvas.height - h, barW - gap, h)
        }
      }
      drawIdle()
      return
    }

    // Set up audio context and analyser
    const audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.75

    const source = audioCtx.createMediaStreamSource(stream)
    source.connect(analyser)

    ctxRef.current = audioCtx
    analyserRef.current = analyser

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx2d.clearRect(0, 0, canvas.width, canvas.height)

      const barW = canvas.width / barCount
      const gap = 2
      const step = Math.floor(dataArray.length / barCount)

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] ?? 0
        const normalised = value / 255
        const h = Math.max(canvas.height * 0.06, normalised * canvas.height)

        // Color gradient: dim yellow to bright neon
        const alpha = 0.3 + normalised * 0.7
        ctx2d.fillStyle = `rgba(255, 215, 0, ${alpha})`
        ctx2d.fillRect(i * barW + gap / 2, canvas.height - h, barW - gap, h)
      }
    }

    draw()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      audioCtx.close().catch(() => {})
    }
  }, [stream, active, barCount])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={60}
      className={cn('w-full h-16 rounded-sm', className)}
      aria-label="Audio level meter"
      aria-hidden="true"
    />
  )
}
