'use client'
import { useState } from 'react'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NeonCard, NeonCardHeader, NeonCardTitle } from '@/components/ui/neon-card'
import { normalizeRoomId, isValidRoomId } from '@/lib/room-utils'

interface JoinFormProps {
  onJoin: (roomId: string) => void
  isJoining: boolean
  error: string | null
}

export function JoinForm({ onJoin, isJoining, error }: JoinFormProps) {
  const [inputValue, setInputValue]           = useState('')
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
    const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setInputValue(v)
    if (validationError) setValidationError(null)
  }

  const displayError = validationError ?? error

  return (
    <NeonCard>
      <NeonCardHeader>
        <NeonCardTitle>Join Room</NeonCardTitle>
      </NeonCardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="room-code-input"
          className="label text-fg-3 block mb-2"
        >
          Room code
        </label>

        {/* Code input — large, monospace-y */}
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
          className="input-base font-display text-3xl tracking-display text-center text-foreground mb-4"
          style={{ letterSpacing: '0.25em' }}
          aria-label="Enter room code"
          aria-describedby={displayError ? 'join-error-msg' : undefined}
          aria-invalid={!!displayError}
        />

        {displayError && (
          <p
            id="join-error-msg"
            className="flex items-start gap-2 text-xs text-error mb-4"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {displayError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={inputValue.length !== 6 || isJoining}
          id="join-room-btn"
          className="w-full"
        >
          {isJoining ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
              Joining…
            </>
          ) : (
            <>
              Join Room
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-4 text-xs text-fg-3 text-center leading-relaxed">
        Enter the code from the broadcaster&apos;s screen,
        or scan the QR code with your camera app.
      </p>
    </NeonCard>
  )
}
