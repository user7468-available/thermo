import { levelOf } from '../lib/format.js'

/**
 * The one-glance verdict. Green tick when both feet match, red warning when a
 * twin pair has been hot for the required number of days in a row.
 */
const StatusCard = ({ alert, config, onOpenDetail }) => {
  const worstLevel = alert.active ? 'crit' : alert.level
  const level = levelOf(alert.active ? 'crit' : worstLevel)

  const hotFootTh = alert.hotterFoot === 'right' ? 'ขวา' : 'ซ้าย'
  const title = alert.active
    ? `เท้า${hotFootTh}ร้อนผิดปกติ`
    : worstLevel === 'warn'
      ? `เฝ้าระวังเท้า${hotFootTh}`
      : 'เท้าปกติ'

  const detail = alert.active
    ? `${alert.pointShortTh} ร้อนกว่าอีกข้าง ${alert.absDiff.toFixed(1)}°C ต่อเนื่อง ${alert.streak} วัน`
    : worstLevel === 'warn'
      ? `${alert.pointShortTh} ร้อนกว่าอีกข้าง ${alert.absDiff.toFixed(1)}°C — ยังไม่ถึงเกณฑ์ ${config.thresholdC}°C`
      : `ทุกจุดต่างกันไม่เกิน ${config.warnC}°C — ไม่พบจุดเสี่ยง`

  return (
    <button
      type="button"
      onClick={onOpenDetail}
      className="tap w-full rounded-3xl border-2 p-5 text-left shadow-card transition-colors duration-700 ease-medical"
      style={{ backgroundColor: level.bg, borderColor: level.border }}
    >
      <div className="flex items-center gap-4">
        <span className="relative flex shrink-0 items-center justify-center">
          {alert.active && (
            <span
              className="absolute h-16 w-16 rounded-full animate-pulse-ring"
              style={{ backgroundColor: level.dot }}
              aria-hidden="true"
            />
          )}
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-[2rem] text-white transition-colors duration-700 ease-medical"
            style={{ backgroundColor: level.dot }}
            aria-hidden="true"
          >
            {alert.active ? '⚠' : worstLevel === 'warn' ? '!' : '✓'}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block text-[1.55rem] font-semibold leading-tight" style={{ color: level.ink }}>
            {title}
          </span>
          <span className="mt-0.5 block text-[0.95rem] leading-snug" style={{ color: level.ink }}>
            {detail}
          </span>
        </span>
      </div>
      <span className="mt-3 flex items-center justify-between rounded-2xl bg-white/70 px-3.5 py-2 text-[0.92rem] font-medium" style={{ color: level.ink }}>
        {alert.active ? 'ดูคำแนะนำและการแจ้งเตือน' : 'ดูแผนที่เท้าทั้ง 6 จุด'}
        <span aria-hidden="true">→</span>
      </span>
    </button>
  )
}

export default StatusCard
