'use client'
import { useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'

interface AudioMeterProps {
  stream: MediaStream | null
  active: boolean
  className?: string
}

/**
 * AudioMeter — frequency bar visualizer using Web Audio API.
 * Clean, flat amber bars on dark background.
 * No glow, no decorative effects.
 */
export function AudioMeter({ stream, active, className }: AudioMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const ctxRef    = useRef<{ audio: AudioContext; analyser: AnalyserNode; source: MediaStreamAudioSourceNode } | null>(null)

  useEffect(() => {
    if (!active || !stream) {
      cancelAnimationFrame(rafRef.current)
      ctxRef.current?.audio.close()
      ctxRef.current = null
      drawIdle()
      return
    }

    const audio    = new AudioContext()
    const analyser = audio.createAnalyser()
    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.8

    const source = audio.createMediaStreamSource(stream)
    source.connect(analyser)
    ctxRef.current = { audio, analyser, source }

    const data = new Uint8Array(analyser.frequencyBinCount)

    function draw() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      analyser.getByteFrequencyData(data)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barCount = Math.min(data.length, 24)
      const gap      = 2
      const barW     = (canvas.width - gap * (barCount - 1)) / barCount

      for (let i = 0; i < barCount; i++) {
        const ratio  = data[i]! / 255
        const barH   = Math.max(2, ratio * canvas.height)
        const x      = i * (barW + gap)
        const y      = canvas.height - barH

        // Flat amber fill — no glow
        const alpha = 0.35 + ratio * 0.65
        ctx.fillStyle = `rgba(200, 150, 12, ${alpha})`
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(barW), Math.round(barH))
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      audio.close()
      ctxRef.current = null
    }
  }, [stream, active])

  function drawIdle() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Static low bars when idle
    const barCount = 24
    const gap  = 2
    const barW = (canvas.width - gap * (barCount - 1)) / barCount
    for (let i = 0; i < barCount; i++) {
      const h = 2 + Math.sin(i * 0.9) * 2
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.fillRect(
        Math.round(i * (barW + gap)),
        Math.round(canvas.height - h),
        Math.round(barW),
        Math.round(h)
      )
    }
  }

  useEffect(() => { drawIdle() }, [])

  return (
    <div className={cn('w-full', className)} aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={280}
        height={40}
        className="w-full h-10 block"
      />
    </div>
  )
}
