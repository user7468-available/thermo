import { LEVELS } from '../lib/format.js'

/** Colour key for the foot map. Icon + label, never colour alone. */
const Legend = () => (
  <div className="rounded-2xl bg-brand-50 p-3.5">
    <p className="mb-2 text-sm font-medium text-ink-soft">ความหมายของสี (ผลต่างซ้าย–ขวา)</p>
    <ul className="space-y-2">
      {['good', 'warn', 'crit'].map((id) => {
        const level = LEVELS[id]
        return (
          <li key={id} className="flex items-center gap-2.5">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white"
              style={{ backgroundColor: level.dot }}
              aria-hidden="true"
            >
              {level.icon}
            </span>
            <span className="text-[0.95rem] font-medium" style={{ color: level.ink }}>
              {level.labelTh}
            </span>
            <span className="text-[0.9rem] text-ink-muted">{level.rangeTh}</span>
          </li>
        )
      })}
    </ul>
  </div>
)

export default Legend
