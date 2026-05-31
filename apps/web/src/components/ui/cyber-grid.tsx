/**
 * CyberGrid — removed per design PRD.
 *
 * Decorative grid backgrounds with glow are forbidden by the design system.
 * Pages use a flat #090909 background. No grid, no gradient, no decoration.
 *
 * This file is kept as a no-op export so existing imports don't break
 * while each page is migrated to remove the usage.
 */
export function CyberGrid(_props: { withGlow?: boolean; className?: string }) {
  return null
}
