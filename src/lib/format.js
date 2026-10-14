/** Thai-facing formatting helpers + the single source of truth for status colors. */

export const LEVELS = {
  good: {
    id: 'good',
    labelTh: 'ปกติ',
    rangeTh: 'ต่างกันน้อยกว่า 1.5°C',
    dot: '#0ca30c',
    ink: '#116b11',
    bg: '#e8f7e8',
    border: '#9ddc9d',
    icon: '✓',
  },
  warn: {
    id: 'warn',
    labelTh: 'เฝ้าระวัง',
    rangeTh: 'ต่างกัน 1.5–2.2°C',
    dot: '#fab219',
    ink: '#8a5a06',
    bg: '#fdf3dd',
    border: '#f2cf84',
    icon: '!',
  },
  crit: {
    id: 'crit',
    labelTh: 'ร้อนผิดปกติ',
    rangeTh: 'ต่างกันมากกว่า 2.2°C',
    dot: '#d03b3b',
    ink: '#a81f1f',
    bg: '#fbe9e9',
    border: '#eaa3a3',
    icon: '⚠',
  },
}

export const levelOf = (id) => LEVELS[id] ?? LEVELS.good

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

/** 2026-10-14 → "14 ต.ค. 69" (Buddhist era, short) */
export const formatThaiDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`)
  const be = (d.getFullYear() + 543) % 100
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${String(be).padStart(2, '0')}`
}

export const formatSteps = (n) => n.toLocaleString('th-TH')

/** Always one decimal with a sign, e.g. "+2.8" */
export const formatDiff = (diff) => `${diff > 0 ? '+' : diff < 0 ? '−' : ''}${Math.abs(diff).toFixed(1)}`

export const formatTemp = (c) => `${c.toFixed(1)}°C`

/** 258300 s → "2 วัน 23 ชม. 45 น." */
export const formatCountdown = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  if (days > 0) return `${days} วัน ${hours} ชม. ${minutes} นาที`
  if (hours > 0) return `${hours} ชม. ${minutes} นาที ${seconds} วินาที`
  return `${minutes} นาที ${seconds} วินาที`
}
