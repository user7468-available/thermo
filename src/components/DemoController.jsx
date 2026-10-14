import { useState } from 'react'
import Icon from './Icon.jsx'
import { useApp } from '../state/AppState.jsx'

/** What the judges should be reading at each stage of the replay. */
const narrate = (day) => {
  if (day <= 7) return 'วันที่ 1–7 · เท้าสองข้างอุณหภูมิใกล้เคียงกัน ทุกจุดเป็นสีเขียว'
  if (day <= 9) return 'วันที่ 8–9 · โคนนิ้วโป้งเท้าขวาเริ่มอุ่นขึ้นจากการเดินกว่า 8,000 ก้าว/วัน'
  if (day <= 11) return 'วันที่ 10–11 · ผลต่างเข้าโซนเฝ้าระวัง จุดเปลี่ยนเป็นสีเหลือง'
  if (day <= 13) return `วันที่ ${day} · ผลต่างเกินเกณฑ์ 2.2°C แล้ว จุดเปลี่ยนเป็นสีแดง`
  return 'วันที่ 14 · เกินเกณฑ์ครบ 3 วันติดกัน → ระบบแจ้งเตือนอัตโนมัติ'
}

/**
 * Floating demo player: replays all 14 days in ~28 s so the colour change,
 * the climbing trend line and the automatic alert can be filmed in one take.
 * Collapsible, because during the replay the data underneath is the point.
 */
const DemoController = () => {
  const { demo, totalDays, startDemo, pauseDemo, resumeDemo, resetDemo, exitDemo, seekDemo } =
    useApp()
  const [expanded, setExpanded] = useState(true)

  if (!demo.active) {
    return (
      <button
        type="button"
        onClick={() => {
          setExpanded(true)
          startDemo()
        }}
        className="tap absolute bottom-[84px] right-3.5 z-30 flex h-[60px] w-[60px] flex-col items-center justify-center gap-0.5 rounded-full bg-brand-500 text-white shadow-lift ring-4 ring-white"
        aria-label="เริ่มโหมดสาธิต 14 วัน"
      >
        <Icon name="play" size={20} />
        <span className="text-[0.64rem] font-semibold leading-none">สาธิต</span>
      </button>
    )
  }

  const pct = ((demo.day - 1) / (totalDays - 1)) * 100

  const PlayPause = ({ className }) => (
    <button
      type="button"
      onClick={demo.playing ? pauseDemo : resumeDemo}
      className={className}
      aria-label={demo.playing ? 'หยุดชั่วคราว' : 'เล่น'}
    >
      {demo.playing ? (
        <>
          <span aria-hidden="true" className="tracking-tighter">
            ❚❚
          </span>{' '}
          {expanded && 'หยุดชั่วคราว'}
        </>
      ) : (
        <>
          <Icon name="play" size={20} /> {expanded && (demo.day >= totalDays ? 'เล่นอีกครั้ง' : 'เล่น')}
        </>
      )}
    </button>
  )

  return (
    <div className="absolute bottom-[78px] left-3 right-3 z-30 animate-rise rounded-3xl border-2 border-brand-200 bg-white p-3 shadow-lift">
      <div className="flex items-center gap-2">
        <p className="flex-1 whitespace-nowrap text-[1.02rem] font-semibold text-brand-700">
          {expanded && 'โหมดสาธิต · '}วันที่{' '}
          <span className="tabular-nums text-[1.28rem]">{demo.day}</span>
          <span className="text-ink-muted">/{totalDays}</span>
        </p>
        {!expanded && (
          <>
            <PlayPause className="tap flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 text-[1rem] font-semibold text-white" />
            <button
              type="button"
              onClick={resetDemo}
              aria-label="เริ่มใหม่"
              className="tap flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-200 px-3 text-[1.05rem] text-brand-600"
            >
              ↺
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'ย่อแผงควบคุม' : 'ขยายแผงควบคุม'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[0.9rem] text-ink-muted"
        >
          {expanded ? '▾' : '▴'}
        </button>
        {expanded && (
          <button
            type="button"
            onClick={exitDemo}
            className="min-h-[36px] rounded-full px-1 text-[0.88rem] font-medium text-ink-muted"
          >
            ออก ✕
          </button>
        )}
      </div>

      {expanded ? (
        <>
          <input
            type="range"
            min="1"
            max={totalDays}
            step="1"
            value={demo.day}
            onChange={(e) => seekDemo(Number(e.target.value))}
            aria-label="เลื่อนดูวันที่"
            className="mb-1 h-8 w-full accent-brand-500"
          />
          <p className="mb-2.5 min-h-[2.6rem] text-[0.9rem] leading-snug text-ink-soft">
            {narrate(demo.day)}
          </p>
          <div className="flex gap-2">
            <PlayPause className="tap flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 text-[1.05rem] font-semibold text-white" />
            <button
              type="button"
              onClick={resetDemo}
              className="tap flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-200 px-4 text-[1.02rem] font-medium text-brand-600"
            >
              <span aria-hidden="true">↺</span> เริ่มใหม่
            </button>
          </div>
        </>
      ) : (
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default DemoController
