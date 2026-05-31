// ──────────────────────────────────────────────────────────────────────────────
// QR code generation wrapper (server-safe)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Generate a QR code data URL for the given text.
 * Returns null if called in a non-browser environment or on error.
 */
export async function generateQRCodeDataUrl(text: string): Promise<string | null> {
  try {
    // Dynamic import so this never runs on the server side
    const QRCode = (await import('qrcode')).default
    const dataUrl = await QRCode.toDataURL(text, {
      width: 260,
      margin: 2,
      color: {
        dark: '#FFD700',
        light: '#080808',
      },
      errorCorrectionLevel: 'M',
    })
    return dataUrl
  } catch (err) {
    console.error('[qr] Failed to generate QR code:', err)
    return null
  }
}
