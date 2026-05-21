// src/constants/status.js
// Centralized status color definitions — used across StageDetail, Alerts, and AlertCard

/**
 * Raw hex values for each status level.
 * Used when applying styles via inline `style={{ }}` props.
 */
export const STATUS_COLORS = {
  EMERGENCY:   { bg: '#FEE2E2', text: '#991B1B', border: '#DC2626' },
  ABNORMAL:    { bg: '#FEF3C7', text: '#92400E', border: '#D97706' },
  NORMAL:      { bg: '#DCFCE7', text: '#166534', border: '#16A34A' },
  MAINTENANCE: { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' },
}

/**
 * Tailwind class strings for left-border alert cards (used in AlertCard, etc.)
 * Separate from STATUS_COLORS because they mix Tailwind arbitrary values with opacity modifiers.
 */
export const ALERT_CARD_STYLES = {
  EMERGENCY:   {
    border: 'border-l-[#DC2626] bg-[#FEE2E2]/40',
    badge:  'bg-[#FEE2E2] text-[#991B1B] border border-[#DC2626]',
  },
  ABNORMAL:    {
    border: 'border-l-[#D97706] bg-[#FEF3C7]/40',
    badge:  'bg-[#FEF3C7] text-[#92400E] border border-[#D97706]',
  },
  NORMAL:      {
    border: 'border-l-[#16A34A] bg-[#DCFCE7]/20',
    badge:  'bg-[#DCFCE7] text-[#166534] border border-[#16A34A]',
  },
  MAINTENANCE: {
    border: 'border-l-[#9CA3AF] bg-[#F3F4F6]/40',
    badge:  'bg-[#F3F4F6] text-[#374151] border border-[#9CA3AF]',
  },
}
