import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import StatusCard from '../components/StatusCard.jsx'
import { formatCountdown, formatSteps, formatThaiDate, levelOf } from '../lib/format.js'
import { useApp } from '../state/AppState.jsx'

const HomeScreen = () => {
  const {
    reading,
    alert,
    config,
    stepGoal,
    restMode,
    restMsLeft,
    setTab,
    openAlertOverlay,
    recordFootCheck,
    lastCheckDay,
    viewDay,
  } = useApp()

  const [scanning, setScanning] = useState(false)
  const level = levelOf(alert.active ? 'crit' : alert.level)

  useEffect(() => {
    if (!scanning) return undefined
    const id = setTimeout(() => {
      setScanning(false)
      recordFootCheck()
      setTab('map')
    }, 1700)
    return () => clearTimeout(id)
  }, [scanning, recordFootCheck, setTab])

  return (
    <div className="space-y-4 pb-4">
      <header className="flex items-end justify-between pt-1">
        <div>
          <p className="text-[0.92rem] text-ink-soft">สวัสดีค่ะ คุณสมศรี</p>
          <h2 className="text-[1.5rem] font-semibold leading-tight text-brand-700">
            วันนี้ {formatThaiDate(reading.dateIso)}
          </h2>
        </div>
        <span className="mb-1 rounded-full bg-brand-50 px-3 py-1 text-[0.8rem] font-medium text-brand-600">
          วันที่ {viewDay} ของการใช้งาน
        </span>
      </header>

      <StatusCard
        alert={alert}
        config={config}
        onOpenDetail={() => (alert.active ? openAlertOverlay() : setTab('map'))}
      />

      {restMode.active && (
        <div className="animate-rise rounded-3xl border-2 border-brand-200 bg-brand-50 p-4">
          <p className="text-[1.05rem] font-semibold text-brand-700">
            <span aria-hidden="true">🦶 </span>โหมดพักเท้ากำลังทำงาน
          </p>
          <p className="mt-0.5 text-[0.92rem] text-ink-soft">
            เหลือเวลา {formatCountdown(restMsLeft)} · เป้าหมายลดเหลือ {formatSteps(config.restStepGoal)} ก้าว
          </p>
        </div>
      )}

      <section className="card flex flex-col items-center">
        <div className="mb-1 flex w-full items-center justify-between">
          <h3 className="text-[1.1rem] font-semibold text-brand-700">ก้าวเดินวันนี้</h3>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-[0.82rem] font-medium text-brand-600">
            เป้า {formatSteps(stepGoal)} ก้าว
          </span>
        </div>
        <ProgressRing
          value={reading.steps}
          goal={stepGoal}
          color={restMode.active ? '#0ca30c' : '#0b4f9e'}
        />
        <p className="mt-2 text-center text-[0.92rem] leading-snug text-ink-soft">
          {reading.steps > stepGoal
            ? 'เดินเกินเป้าหมายวันนี้ — การลงน้ำหนักซ้ำ ๆ ทำให้จุดเสี่ยงร้อนขึ้น'
            : 'อยู่ในเกณฑ์เป้าหมาย ช่วยลดแรงกดที่ฝ่าเท้า'}
        </p>
      </section>

      <button type="button" className="btn-primary" onClick={() => setScanning(true)}>
        <Icon name="scan" size={22} /> ตรวจเท้าวันนี้
      </button>

      {lastCheckDay && (
        <p className="text-center text-[0.88rem] text-ink-muted">
          ตรวจล่าสุด: วันที่ {lastCheckDay} ของการใช้งาน
        </p>
      )}

      <section className="card">
        <h3 className="mb-2 text-[1.05rem] font-semibold text-brand-700">สรุป 6 จุดวัด</h3>
        <div className="flex items-center justify-between gap-2">
          {reading.points.map((p) => {
            const l = levelOf(p.level)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setTab('map')}
                className="tap flex flex-1 flex-col items-center gap-1 rounded-2xl py-2"
                aria-label={`${p.id} ${l.labelTh}`}
              >
                <span
                  className="h-7 w-7 rounded-full ring-2 ring-white transition-colors duration-700 ease-medical"
                  style={{ backgroundColor: l.dot }}
                  aria-hidden="true"
                />
                <span className="text-[0.75rem] tabular-nums" style={{ color: l.ink }}>
                  {p.absDiff.toFixed(1)}°
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-1 text-center text-[0.85rem]" style={{ color: level.ink }}>
          <span aria-hidden="true">{level.icon} </span>
          {alert.active
            ? `พบ 1 จุดเกินเกณฑ์ ${config.thresholdC}°C`
            : alert.level === 'warn'
              ? 'มีจุดที่ควรเฝ้าระวัง 1 จุด'
              : 'ทั้ง 6 จุดอยู่ในเกณฑ์ปกติ'}
        </p>
      </section>

      {scanning && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-brand-700/92 px-8 text-center backdrop-blur-sm">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/25 border-t-white" />
          <p className="text-[1.25rem] font-semibold text-white">กำลังอ่านค่าเซ็นเซอร์ 12 จุด...</p>
          <p className="text-[0.95rem] text-brand-100">กรุณายืนนิ่ง ๆ สักครู่</p>
        </div>
      )}
    </div>
  )
}

export default HomeScreen
