import { SENSOR_POINTS } from '../data/sensorPoints.js'
import { formatDiff, formatTemp, levelOf } from '../lib/format.js'

/**
 * Tabular view of all 6 twin pairs — the accessible counterpart to the dots
 * (and a much bigger tap target than the diagram).
 */
const SensorList = ({ points, selectedId, onSelect }) => {
  const byId = Object.fromEntries(points.map((p) => [p.id, p]))

  return (
    <ul className="space-y-2">
      {SENSOR_POINTS.map((point) => {
        const reading = byId[point.id]
        const level = levelOf(reading.level)
        const selected = selectedId === point.id

        return (
          <li key={point.id}>
            <button
              type="button"
              onClick={() => onSelect(point.id)}
              className={`tap flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left ${
                selected ? 'border-brand-500 bg-brand-50' : 'border-brand-100 bg-white'
              }`}
              aria-pressed={selected}
            >
              <span
                className="h-5 w-5 shrink-0 rounded-full ring-2 ring-white transition-colors duration-700 ease-medical"
                style={{ backgroundColor: level.dot }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[1.02rem] font-medium leading-tight">
                  {point.shortTh}
                </span>
                <span className="block text-[0.85rem] text-ink-muted">
                  ซ้าย {formatTemp(reading.left)} · ขวา {formatTemp(reading.right)}
                </span>
                {reading.level !== 'good' && (
                  <span className="block text-[0.8rem] font-medium" style={{ color: level.ink }}>
                    เท้า{reading.hotterFoot === 'right' ? 'ขวา' : 'ซ้าย'}ร้อนกว่า
                  </span>
                )}
              </span>
              <span className="text-right">
                <span
                  className="block text-[1.15rem] font-semibold tabular-nums leading-tight transition-colors duration-700 ease-medical"
                  style={{ color: level.ink }}
                >
                  {formatDiff(reading.diff)}°
                </span>
                <span className="block text-[0.8rem]" style={{ color: level.ink }}>
                  {level.labelTh}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default SensorList
