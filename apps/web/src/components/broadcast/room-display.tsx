'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Copy, Check, QrCode } from 'lucide-react'
import { NeonCard, NeonCardHeader, NeonCardTitle } from '@/components/ui/neon-card'
import { Button } from '@/components/ui/button'
import { generateQRCodeDataUrl } from '@/lib/qr'

interface RoomDisplayProps {
  roomId: string
  joinUrl: string
}

/**
 * RoomDisplay — shows the room code, QR code, and copy button for the broadcaster.
 */
export function RoomDisplay({ roomId, joinUrl }: RoomDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    generateQRCodeDataUrl(joinUrl).then(setQrDataUrl)
  }, [joinUrl])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <NeonCard className="flex flex-col items-center text-center gap-6">
      <NeonCardHeader className="flex-col items-center gap-2 mb-0">
        <NeonCardTitle>Room Code</NeonCardTitle>
        <p className="text-xs text-foreground/50 uppercase tracking-wide">
          Share this with your phone
        </p>
      </NeonCardHeader>

      {/* Room ID display */}
      <div
        className="font-display text-6xl tracking-widest text-neon-yellow py-3 px-6 border border-neon-yellow/20 bg-neon-yellow/5 rounded-sm w-full"
        aria-label={`Room code: ${roomId.split('').join(' ')}`}
      >
        {roomId}
      </div>

      {/* Copy button */}
      <Button
        variant="outline"
        size="md"
        onClick={handleCopy}
        id="copy-room-code-btn"
        aria-label="Copy room code to clipboard"
        className="w-full"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy Code
          </>
        )}
      </Button>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-foreground/50">
          <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Or scan QR code</span>
        </div>

        <div className="relative rounded-sm border border-neon-yellow/20 p-2 bg-[#080808]">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt={`QR code to join room ${roomId}`}
              width={220}
              height={220}
              className="rounded-sm"
              unoptimized
            />
          ) : (
            <div
              className="w-[220px] h-[220px] flex items-center justify-center"
              aria-label="Loading QR code"
            >
              <div className="h-8 w-8 rounded-full border-2 border-neon-yellow/30 border-t-neon-yellow animate-spin" />
            </div>
          )}
        </div>

        <p className="text-xs text-foreground/30 max-w-[220px] text-center">
          Point your phone camera at this code to join instantly
        </p>
      </div>
    </NeonCard>
  )
}
