import { formatCountdown, formatSteps } from '../lib/format.js'
import { useApp } from '../state/AppState.jsx'

const ADVICE = [
  {
    icon: '🪑',
    title: 'พักเท้าข้างที่ร้อน',
    body: 'นั่งพักให้มากขึ้น ยกเท้าสูงเล็กน้อย อย่าลงน้ำหนักเท้าข้างนั้นนาน ๆ',
  },
  {
    icon: '🚶',
    title: 'เลี่ยงการเดินไกล',
    body: 'งดเดินต่อเนื่องเกิน 10 นาที และงดยืนนานในวันนี้',
  },
  {
    icon: '👟',
    title: 'เปลี่ยนรองเท้าให้นุ่ม',
    body: 'ใส่รองเท้าที่ไม่กดทับโคนนิ้วโป้ง และตรวจหาสิ่งแปลกปลอมในรองเท้า',
  },
  {
    icon: '🏥',
    title: 'พบแพทย์ภายใน 72 ชั่วโมง',
    body: 'แจ้งพยาบาลเท้าเบาหวานว่า “อุณหภูมิเท้าขวาสูงกว่าซ้าย 3 วันติดกัน”',
  },
]

/**
 * The early-warning screen. Rendered inline as a tab, or as a full-bleed
 * overlay the moment the 3-consecutive-day rule is met.
 */
const AlertView = ({ variant = 'screen' }) => {
  const {
    alert,
    config,
    restMode,
    restMsLeft,
    enableRestMode,
    disableRestMode,
    caregiver,
    notifyCaregiver,
    closeAlertOverlay,
    setTab,
  } = useApp()

  const hotFootTh = alert.hotterFoot === 'right' ? 'ขวา' : 'ซ้าย'

  if (!alert.active && variant === 'screen') {
    return (
      <div className="space-y-4 pb-4">
        <header className="pt-1">
          <h2 className="text-[1.5rem] font-semibold leading-tight text-brand-700">การแจ้งเตือน</h2>
          <p className="mt-0.5 text-[0.92rem] text-ink-soft">
            ระบบจะเตือนเมื่อจุดเดียวกันร้อนกว่าอีกข้างเกิน {config.thresholdC}°C ติดกัน{' '}
            {config.consecutiveDaysForAlert} วัน
          </p>
        </header>
        <div className="card flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-status-good-bg text-[2.4rem]" aria-hidden="true">
            ✓
          </span>
          <p className="text-[1.3rem] font-semibold text-status-good-ink">ยังไม่มีการแจ้งเตือน</p>
          <p className="max-w-[16rem] text-[0.95rem] leading-relaxed text-ink-soft">
            {alert.streak > 0
              ? `ขณะนี้ ${alert.pointShortTh} เกินเกณฑ์มาแล้ว ${alert.streak} วัน — ระบบกำลังเฝ้าติดตาม`
              : 'เท้าทั้งสองข้างอุณหภูมิใกล้เคียงกัน ใส่แผ่นรองทุกวันเพื่อให้ระบบเฝ้าระวังต่อเนื่อง'}
          </p>
          {restMode.active && (
            <p className="rounded-2xl bg-brand-50 px-4 py-2 text-[0.92rem] text-brand-700">
              โหมดพักเท้าเหลือ {formatCountdown(restMsLeft)}
            </p>
          )}
        </div>
      </div>
    )
  }

  const isOverlay = variant === 'overlay'

  return (
    <div
      className={
        isOverlay
          ? 'absolute inset-0 z-50 flex animate-alert-in flex-col overflow-y-auto bg-status-crit px-5 pb-6 pt-8 no-scrollbar'
          : 'animate-rise -mx-5 -mt-4 flex min-h-full flex-col bg-status-crit px-5 pb-6 pt-6'
      }
      role="alertdialog"
      aria-label="การแจ้งเตือนเท้าร้อนผิดปกติ"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex items-center justify-center">
            <span className="absolute h-14 w-14 rounded-full bg-white/60 animate-pulse-ring" aria-hidden="true" />
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[1.9rem] text-status-crit" aria-hidden="true">
              ⚠
            </span>
          </span>
          <p className="text-[0.95rem] font-semibold uppercase tracking-wide text-white/90">
            การแจ้งเตือนเร่งด่วน
          </p>
        </div>
        {isOverlay && (
          <button
            type="button"
            onClick={closeAlertOverlay}
            className="tap flex h-11 w-11 min-h-[44px] items-center justify-center rounded-full bg-white/20 text-[1.3rem] text-white"
            aria-label="ปิดการแจ้งเตือน"
          >
            ✕
          </button>
        )}
      </div>

      <h2 className="mt-4 text-[1.85rem] font-bold leading-tight text-white">
        ⚠️ เตือน! เท้า{hotFootTh}ร้อนผิดปกติ {alert.streak} วันติดต่อกัน
      </h2>
      <p className="mt-2 text-[1.05rem] leading-relaxed text-white/95">
        จุด “{alert.pointShortTh}” ของเท้า{hotFootTh} ร้อนกว่าเท้าอีกข้าง{' '}
        <span className="font-bold">{alert.absDiff.toFixed(1)}°C</span> (เกณฑ์ {config.thresholdC}°C)
      </p>
      <p className="mt-2 rounded-2xl bg-white/15 p-3 text-[0.98rem] leading-relaxed text-white">
        นี่คือสัญญาณว่าเนื้อเยื่อใต้ผิวหนังกำลังอักเสบ และอาจกลายเป็นแผลภายใน 1–2 สัปดาห์
        แม้ตอนนี้จะยังไม่มีแผลและไม่รู้สึกเจ็บก็ตาม
      </p>

      <h3 className="mt-5 text-[1.15rem] font-semibold text-white">สิ่งที่ควรทำวันนี้</h3>
      <ul className="mt-2 space-y-2">
        {ADVICE.map((item) => (
          <li key={item.title} className="flex gap-3 rounded-2xl bg-white p-3.5">
            <span className="text-[1.5rem] leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <span>
              <span className="block text-[1.05rem] font-semibold leading-tight text-status-crit-ink">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[0.93rem] leading-snug text-ink-soft">{item.body}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-3">
        {restMode.active ? (
          <div className="rounded-2xl bg-white p-4">
            <p className="text-[1.08rem] font-semibold text-status-good-ink">
              <span aria-hidden="true">✓ </span>โหมดพักเท้าเปิดอยู่
            </p>
            <p className="mt-0.5 text-[0.92rem] text-ink-soft">
              เป้าหมายลดจาก {formatSteps(config.stepGoal)} เหลือ {formatSteps(config.restStepGoal)} ก้าว/วัน
            </p>
            <p className="mt-2 text-[0.85rem] text-ink-muted">เหลือเวลาก่อนครบกำหนดพบแพทย์</p>
            <p className="text-[1.6rem] font-bold tabular-nums leading-tight text-status-crit">
              {formatCountdown(restMsLeft)}
            </p>
            <button
              type="button"
              onClick={disableRestMode}
              className="tap mt-2 flex w-full items-center justify-center rounded-xl border-2 border-brand-100 px-4 text-[0.95rem] font-medium text-ink-soft"
            >
              ปิดโหมดพักเท้า
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={enableRestMode}
            className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-[1.15rem] font-semibold text-status-crit-ink shadow-lift"
          >
            <span aria-hidden="true">🦶</span> เปิดโหมดพักเท้า
          </button>
        )}

        {caregiver.status === 'sent' ? (
          <div className="rounded-2xl border-2 border-white/40 bg-white/15 p-4 text-white">
            <p className="text-[1.05rem] font-semibold">
              <span aria-hidden="true">✓ </span>แจ้งลูกหลานแล้ว
            </p>
            <p className="mt-0.5 text-[0.92rem] text-white/90">
              ส่งถึง “คุณนิด (ลูกสาว)” เวลา{' '}
              {caregiver.at?.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </p>
            <p className="mt-2 rounded-xl bg-white/20 p-2.5 text-[0.88rem] leading-snug">
              “คุณแม่มีสัญญาณเท้า{hotFootTh}ร้อนผิดปกติ {alert.streak} วันติดกัน ควรพาไปพบแพทย์ภายใน{' '}
              {config.seeDoctorHours} ชั่วโมง”
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={notifyCaregiver}
            disabled={caregiver.status === 'sending'}
            className="tap flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white px-5 text-[1.1rem] font-semibold text-white disabled:opacity-70"
          >
            {caregiver.status === 'sending' ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                กำลังส่ง...
              </>
            ) : (
              <>
                <span aria-hidden="true">📲</span> แจ้งลูกหลาน
              </>
            )}
          </button>
        )}

        {isOverlay && (
          <button
            type="button"
            onClick={() => {
              closeAlertOverlay()
              setTab('trend')
            }}
            className="tap flex w-full items-center justify-center rounded-2xl px-5 text-[1rem] font-medium text-white/90 underline underline-offset-4"
          >
            ดูกราฟแนวโน้ม 14 วัน
          </button>
        )}
      </div>
    </div>
  )
}

export default AlertView
