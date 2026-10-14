import { formatSteps } from '../lib/format.js'

/** Step progress ring. Large numerals — the main read for elderly users. */
const ProgressRing = ({ value, goal, color = '#0b4f9e', size = 148, label = 'ก้าว' }) => {
  const stroke = 13
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, goal > 0 ? value / goal : 0)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eef8" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,0.61,0.36,1), stroke 0.5s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[1.85rem] font-semibold tabular-nums leading-none text-brand-700">
          {formatSteps(value)}
        </span>
        <span className="mt-0.5 text-[0.85rem] text-ink-muted">{label}</span>
        <span className="mt-1 text-[0.8rem] font-medium" style={{ color }}>
          {Math.round(pct * 100)}% ของเป้า
        </span>
      </div>
    </div>
  )
}

export default ProgressRing
