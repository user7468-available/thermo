import { useMemo, useState } from 'react'
import { formatDiff, formatTemp, formatThaiDate, levelOf } from '../lib/format.js'

const W = 340
const H = 212
const PAD = { l: 32, r: 16, t: 16, b: 30 }
const Y_MAX = 3.2
const PLOT_W = W - PAD.l - PAD.r
const PLOT_H = H - PAD.t - PAD.b

/**
 * 14-day line chart of the left/right temperature difference for one sensor
 * point. One series, so no legend box — the title names it. Threshold is drawn
 * as a status rule (dashed + labelled, never colour alone) and every day at or
 * above it gets a shaded band.
 */
const TrendChart = ({ series, totalDays, thresholdC, warnC }) => {
  const [activeDay, setActiveDay] = useState(null)

  const x = (day) => PAD.l + ((day - 1) / (totalDays - 1)) * PLOT_W
  const y = (v) => PAD.t + (1 - Math.min(Math.abs(v), Y_MAX) / Y_MAX) * PLOT_H
  const halfStep = PLOT_W / (totalDays - 1) / 2

  const linePath = useMemo(
    () =>
      series
        .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(d.day).toFixed(1)} ${y(d.absDiff).toFixed(1)}`)
        .join(' '),
    [series, totalDays],
  )

  const areaPath = useMemo(() => {
    if (series.length < 2) return ''
    const last = series[series.length - 1]
    return `${linePath} L${x(last.day).toFixed(1)} ${y(0).toFixed(1)} L${x(series[0].day).toFixed(1)} ${y(0).toFixed(1)} Z`
  }, [linePath, series, totalDays])

  const crossed = series.filter((d) => d.absDiff >= thresholdC)
  const hovered = activeDay ? series.find((d) => d.day === activeDay) : null
  const last = series[series.length - 1]
  const lastLevel = levelOf(last.level)

  const handlePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const day = Math.round(ratio * W >= PAD.l ? ((ratio * W - PAD.l) / PLOT_W) * (totalDays - 1) + 1 : 1)
    const clamped = Math.min(series.length, Math.max(1, day))
    setActiveDay(clamped)
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label={`กราฟผลต่างอุณหภูมิซ้าย-ขวา ${series.length} วัน ค่าล่าสุด ${last.absDiff.toFixed(1)} องศา`}
        onPointerDown={handlePointer}
        onPointerMove={(e) => (e.buttons || e.pointerType === 'mouse') && handlePointer(e)}
        onPointerLeave={() => setActiveDay(null)}
      >
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b4f9e" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0b4f9e" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Days where the threshold was crossed */}
        {crossed.map((d) => (
          <rect
            key={d.day}
            x={Math.max(PAD.l, x(d.day) - halfStep)}
            y={PAD.t}
            width={Math.min(halfStep * 2, x(d.day) + halfStep - PAD.l)}
            height={PLOT_H}
            fill="#d03b3b"
            opacity="0.1"
            className="transition-all duration-500 ease-medical"
          />
        ))}

        {/* Recessive grid + y labels */}
        {[0, 1, 2, 3].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              y1={y(v)}
              x2={W - PAD.r}
              y2={y(v)}
              stroke="#d6e4f7"
              strokeWidth="1"
            />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#7c8798">
              {v}
            </text>
          </g>
        ))}

        {/* Warn band edge (1.5 °C) — subtle, unlabelled */}
        <line
          x1={PAD.l}
          y1={y(warnC)}
          x2={W - PAD.r}
          y2={y(warnC)}
          stroke="#fab219"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.8"
        />

        {/* Threshold */}
        <line
          x1={PAD.l}
          y1={y(thresholdC)}
          x2={W - PAD.r}
          y2={y(thresholdC)}
          stroke="#d03b3b"
          strokeWidth="2"
          strokeDasharray="7 5"
        />
        {/* Label sits on the left, where the early (flat) days leave room */}
        <text x={PAD.l + 3} y={y(thresholdC) - 6} textAnchor="start" fontSize="10.5" fill="#a81f1f" fontWeight="600">
          เกณฑ์เตือน {thresholdC}°C
        </text>

        <path d={areaPath} fill="url(#trendFill)" className="transition-all duration-500 ease-medical" />
        <path
          d={linePath}
          fill="none"
          stroke="#0b4f9e"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 ease-medical"
        />

        {series.map((d) => {
          const level = levelOf(d.level)
          const isLast = d.day === last.day
          return (
            <circle
              key={d.day}
              cx={x(d.day)}
              cy={y(d.absDiff)}
              r={isLast ? 5.5 : 4.5}
              fill={level.dot}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-500 ease-medical"
            />
          )
        })}

        {/* Direct label on the newest point only */}
        <g className="transition-all duration-500 ease-medical">
          <rect
            x={Math.min(x(last.day) - 20, W - PAD.r - 40)}
            y={Math.max(y(last.absDiff) - 27, 2)}
            width="40"
            height="19"
            rx="6"
            fill={lastLevel.dot}
          />
          <text
            x={Math.min(x(last.day), W - PAD.r - 20)}
            y={Math.max(y(last.absDiff) - 13.5, 15.5)}
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="700"
            fill="#ffffff"
          >
            {last.absDiff.toFixed(1)}°
          </text>
        </g>

        {/* Crosshair */}
        {hovered && (
          <line
            x1={x(hovered.day)}
            y1={PAD.t}
            x2={x(hovered.day)}
            y2={PAD.t + PLOT_H}
            stroke="#072d5e"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        )}

        {/* X axis */}
        <line x1={PAD.l} y1={PAD.t + PLOT_H} x2={W - PAD.r} y2={PAD.t + PLOT_H} stroke="#aec9ef" strokeWidth="1.2" />
        {[1, 4, 7, 10, 14].map((d) => (
          <text key={d} x={x(d)} y={H - 10} textAnchor="middle" fontSize="10.5" fill="#7c8798">
            วัน {d}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 w-[160px] rounded-xl border border-brand-100 bg-white/97 p-2.5 shadow-lift"
          style={{
            left: `${Math.min(Math.max((x(hovered.day) / W) * 100, 24), 76)}%`,
            top: '4%',
            transform: 'translateX(-50%)',
          }}
        >
          <p className="text-[0.8rem] font-semibold text-brand-700">
            วันที่ {hovered.day} · {formatThaiDate(hovered.dateIso)}
          </p>
          <p className="text-[0.78rem] text-ink-soft">ซ้าย {formatTemp(hovered.left)}</p>
          <p className="text-[0.78rem] text-ink-soft">ขวา {formatTemp(hovered.right)}</p>
          <p className="text-[0.9rem] font-semibold" style={{ color: levelOf(hovered.level).ink }}>
            ผลต่าง {formatDiff(hovered.diff)}° · {levelOf(hovered.level).labelTh}
          </p>
        </div>
      )}
    </div>
  )
}

export default TrendChart
