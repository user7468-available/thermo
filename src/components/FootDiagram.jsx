import { SENSOR_POINTS } from '../data/sensorPoints.js'
import { levelOf } from '../lib/format.js'

/** Plantar outline of a LEFT foot (big toe on the right edge). */
const SOLE_PATH =
  'M50 196 C30 196 20 182 22 164 C24 146 30 134 28 116 C26 98 24 88 30 78 C36 68 48 62 58 60 C68 58 78 58 80 66 C82 76 80 88 78 102 C76 120 74 146 72 164 C70 182 68 196 50 196 Z'

const TOES = [
  { cx: 70, cy: 44, rx: 11.5, ry: 15 },
  { cx: 54, cy: 46, rx: 7.2, ry: 9.5 },
  { cx: 42, cy: 49, rx: 6.6, ry: 8.6 },
  { cx: 32, cy: 53, rx: 6, ry: 7.6 },
  { cx: 24, cy: 58, rx: 5.5, ry: 7 },
]

/**
 * Top-down foot diagram with the 6 insole sensor points.
 *
 * Geometry is authored once for the left foot; the right foot is the mirror
 * image (x → 100 − x) so both diagrams stay anatomically consistent.
 */
const FootDiagram = ({ side, points, selectedId, onSelect, isAlerting }) => {
  const mirrored = side === 'right'
  const byId = Object.fromEntries(points.map((p) => [p.id, p]))

  return (
    <svg
      viewBox="0 0 100 210"
      className="h-auto w-full"
      role="group"
      aria-label={side === 'left' ? 'แผนที่เท้าซ้าย' : 'แผนที่เท้าขวา'}
    >
      <g transform={mirrored ? 'translate(100,0) scale(-1,1)' : undefined}>
        <g fill="#e8eef8" stroke="#aec9ef" strokeWidth="1.4">
          <path d={SOLE_PATH} />
          {TOES.map((t, i) => (
            <ellipse key={i} cx={t.cx} cy={t.cy} rx={t.rx} ry={t.ry} />
          ))}
        </g>
      </g>

      {SENSOR_POINTS.map((point) => {
        const reading = byId[point.id]
        if (!reading) return null
        /**
         * The reading is a comparison, but the warning belongs to the foot that
         * is actually hotter — the twin stays green so the story reads at a
         * glance ("the RIGHT foot is the problem").
         */
        const levelId = reading.hotterFoot === side ? reading.level : 'good'
        const level = levelOf(levelId)
        const cx = mirrored ? 100 - point.x : point.x
        const cy = point.y
        const selected = selectedId === point.id
        const pulsing = levelId === 'crit' && isAlerting

        return (
          <g key={point.id}>
            {pulsing && (
              <circle
                cx={cx}
                cy={cy}
                r="8"
                fill={level.dot}
                className="animate-pulse-ring"
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            )}
            {/* Selection halo */}
            <circle
              cx={cx}
              cy={cy}
              r={selected ? 12.5 : 8}
              fill="none"
              stroke={level.dot}
              strokeWidth={selected ? 2 : 0}
              opacity={selected ? 0.55 : 0}
              className="transition-all duration-500 ease-medical"
            />
            {/* The reading itself — 2px surface ring keeps it legible on the foot fill */}
            <circle
              cx={cx}
              cy={cy}
              r={selected ? 9 : 8}
              fill={level.dot}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-700 ease-medical"
            />
            {/* Oversized, invisible hit area — elderly-friendly tap target */}
            <circle
              cx={cx}
              cy={cy}
              r="16"
              fill="transparent"
              className="cursor-pointer"
              onClick={() => onSelect(point.id)}
              role="button"
              tabIndex={0}
              aria-label={`${point.labelTh} เท้า${side === 'left' ? 'ซ้าย' : 'ขวา'} ${level.labelTh}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(point.id)
              }}
            />
          </g>
        )
      })}
    </svg>
  )
}

export default FootDiagram
