'use client'
import { useState } from 'react'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NeonCard, NeonCardHeader, NeonCardTitle } from '@/components/ui/neon-card'
import { normalizeRoomId, isValidRoomId } from '@/lib/room-utils'

interface JoinFormProps {
  onJoin: (roomId: string) => void
  isJoining: boolean
  error: string | null
}

/**
 * JoinForm — receiver enters room code to join a session.
 */
export function JoinForm({ onJoin, isJoining, error }: JoinFormProps) {
  const [inputValue, setInputValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const roomId = normalizeRoomId(inputValue)

    if (!isValidRoomId(roomId)) {
      setValidationError('Room code must be 6 characters (letters and numbers).')
      return
    }

    setValidationError(null)
    onJoin(roomId)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setInputValue(value)
    if (validationError) setValidationError(null)
  }

  const displayError = validationError ?? error

  return (
    <NeonCard>
      <NeonCardHeader>
        <NeonCardTitle>Join Room</NeonCardTitle>
      </NeonCardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label
            htmlFor="room-code-input"
            className="block text-xs uppercase tracking-wide text-foreground/50 mb-2"
          >
            Room Code
          </label>
          <input
            id="room-code-input"
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="XXXXXX"
            maxLength={6}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            disabled={isJoining}
            className="w-full bg-[#080808] border border-neon-yellow/20 rounded-sm px-4 py-3 font-display text-3xl tracking-widest text-neon-yellow text-center placeholder:text-foreground/20 focus:outline-none focus:border-neon-yellow/50 focus:shadow-neon-sm transition-all duration-200 disabled:opacity-50"
            aria-label="Enter room code"
            aria-describedby={displayError ? 'join-error-msg' : undefined}
            aria-invalid={!!displayError}
          />
        </div>

        {displayError && (
          <div
            id="join-error-msg"
            className="mb-4 flex items-start gap-2 rounded-sm border border-red-500/30 bg-red-500/10 p-3"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-red-400">{displayError}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={inputValue.length !== 6 || isJoining}
          id="join-room-btn"
          className="w-full"
          aria-label="Join the room"
        >
          {isJoining ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" aria-hidden="true" />
              Joining...
            </>
          ) : (
            <>
              Join Room
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-4 text-xs text-foreground/35 text-center">
        Type the 6-character code shown on the broadcaster&apos;s screen, or scan the QR code with your camera app.
      </p>
    </NeonCard>
  )
}
