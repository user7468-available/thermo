import ScreenHeader from '../components/ScreenHeader.jsx'
import TrendChart from '../components/TrendChart.jsx'
import { SENSOR_POINTS } from '../data/sensorPoints.js'
import { formatDiff, formatThaiDate, levelOf } from '../lib/format.js'
import { useApp } from '../state/AppState.jsx'

const TrendScreen = () => {
  const { series, selectedPointId, setSelectedPointId, config, totalDays, reading } = useApp()
  const point = SENSOR_POINTS.find((p) => p.id === selectedPointId)
  const last = series[series.length - 1]
  const level = levelOf(last.level)
  const crossedDays = series.filter((d) => d.absDiff >= config.thresholdC)

  return (
    <div className="space-y-4 pb-4">
      <ScreenHeader title="กราฟแนวโน้ม" subtitle="ผลต่างอุณหภูมิ ซ้าย–ขวา ย้อนหลัง 14 วัน" />

      {/* Point picker */}
      <div className="-mx-5 overflow-x-auto px-5 no-scrollbar">
        <div className="flex w-max gap-2">
          {SENSOR_POINTS.map((p) => {
            const r = reading.points.find((x) => x.id === p.id)
            const active = p.id === selectedPointId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPointId(p.id)}
                className={`flex min-h-[46px] items-center gap-2 rounded-full border-2 px-3.5 text-[0.95rem] font-medium transition-all duration-200 ease-medical active:scale-95 ${
                  active
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-brand-100 bg-white text-ink-soft'
                }`}
                aria-pressed={active}
              >
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-white/70 transition-colors duration-700"
                  style={{ backgroundColor: levelOf(r.level).dot }}
                  aria-hidden="true"
                />
                {p.shortTh}
              </button>
            )
          })}
        </div>
      </div>

      <section className="card">
        <h3 className="text-[1.08rem] font-semibold leading-tight text-brand-700">
          {point.labelTh}
        </h3>
        <p className="mb-1 text-[0.86rem] text-ink-muted">
          แกนตั้ง = องศาเซลเซียสที่ต่างกันระหว่างเท้าสองข้าง
        </p>
        <TrendChart
          series={series}
          totalDays={totalDays}
          thresholdC={config.thresholdC}
          warnC={config.warnC}
        />
        <p className="mt-1 text-center text-[0.82rem] text-ink-muted">แตะหรือลากบนกราฟเพื่อดูค่าแต่ละวัน</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="card p-4" style={{ backgroundColor: level.bg, borderColor: level.border }}>
          <p className="text-[0.85rem] text-ink-soft">ผลต่างล่าสุด</p>
          <p className="text-[1.75rem] font-semibold tabular-nums leading-tight" style={{ color: level.ink }}>
            {formatDiff(last.diff)}°C
          </p>
          <p className="text-[0.88rem] font-medium" style={{ color: level.ink }}>
            <span aria-hidden="true">{level.icon} </span>
            {level.labelTh}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[0.85rem] text-ink-soft">วันที่เกินเกณฑ์</p>
          <p className="text-[1.75rem] font-semibold tabular-nums leading-tight text-brand-700">
            {crossedDays.length} <span className="text-[1rem] font-normal">วัน</span>
          </p>
          <p className="text-[0.88rem] text-ink-muted">
            {crossedDays.length >= config.consecutiveDaysForAlert
              ? `ติดต่อกัน ${crossedDays.length} วัน → เข้าเกณฑ์เตือน`
              : `เตือนเมื่อครบ ${config.consecutiveDaysForAlert} วันติดกัน`}
          </p>
        </div>
      </section>

      <section className="card">
        <h3 className="mb-2 text-[1.05rem] font-semibold text-brand-700">ตารางค่ารายวัน</h3>
        <div className="max-h-[260px] overflow-y-auto">
          <table className="w-full text-left text-[0.92rem]">
            <thead className="sticky top-0 bg-white text-[0.82rem] text-ink-muted">
              <tr>
                <th className="py-1.5 font-medium">วัน</th>
                <th className="py-1.5 font-medium">ซ้าย</th>
                <th className="py-1.5 font-medium">ขวา</th>
                <th className="py-1.5 text-right font-medium">ผลต่าง</th>
              </tr>
            </thead>
            <tbody>
              {[...series].reverse().map((d) => {
                const l = levelOf(d.level)
                return (
                  <tr key={d.day} className="border-t border-brand-50">
                    <td className="py-1.5 tabular-nums">
                      {d.day}
                      <span className="ml-1 text-[0.78rem] text-ink-muted">
                        {formatThaiDate(d.dateIso)}
                      </span>
                    </td>
                    <td className="py-1.5 tabular-nums text-ink-soft">{d.left.toFixed(1)}</td>
                    <td className="py-1.5 tabular-nums text-ink-soft">{d.right.toFixed(1)}</td>
                    <td className="py-1.5 text-right font-semibold tabular-nums" style={{ color: l.ink }}>
                      {formatDiff(d.diff)}°
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default TrendScreen
