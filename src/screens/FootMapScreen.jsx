import FootDiagram from '../components/FootDiagram.jsx'
import Legend from '../components/Legend.jsx'
import SensorList from '../components/SensorList.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { dataSource } from '../data/dataSource.js'
import { formatDiff, formatTemp, formatThaiDate, levelOf } from '../lib/format.js'
import { useApp } from '../state/AppState.jsx'

const FootMapScreen = () => {
  const { reading, selectedPointId, setSelectedPointId, alert, config, setTab } = useApp()
  const point = dataSource.getSensorPoint(selectedPointId)
  const detail = reading.points.find((p) => p.id === selectedPointId)
  const level = levelOf(detail.level)
  const hotFoot = detail.diff > 0 ? 'ขวา' : 'ซ้าย'

  return (
    <div className="space-y-4 pb-4">
      <ScreenHeader
        title="แผนที่เท้า"
        subtitle={`ข้อมูลวันที่ ${formatThaiDate(reading.dateIso)} · เซ็นเซอร์ 6 จุดต่อข้าง`}
      />

      <section className="card">
        <div className="grid grid-cols-2 gap-3">
          {['left', 'right'].map((side) => (
            <div key={side} className="flex flex-col items-center">
              <p className="mb-1 text-[1.05rem] font-semibold text-brand-700">
                เท้า{side === 'left' ? 'ซ้าย' : 'ขวา'}
              </p>
              <FootDiagram
                side={side}
                points={reading.points}
                selectedId={selectedPointId}
                onSelect={setSelectedPointId}
                isAlerting={alert.active}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[0.88rem] text-ink-muted">
          แตะจุดสีเพื่อดูอุณหภูมิเทียบซ้าย–ขวา
        </p>
      </section>

      {/* Tapped-point detail */}
      <section
        key={selectedPointId}
        className="animate-rise rounded-3xl border-2 p-4 transition-colors duration-500 ease-medical"
        style={{ backgroundColor: level.bg, borderColor: level.border }}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.85rem] font-medium text-ink-soft">จุดที่เลือก</p>
            <h3 className="text-[1.25rem] font-semibold leading-tight">{point.shortTh}</h3>
            <p className="text-[0.82rem] text-ink-muted">{point.labelEn}</p>
          </div>
          <span
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.9rem] font-semibold text-white"
            style={{ backgroundColor: level.dot }}
          >
            <span aria-hidden="true">{level.icon}</span>
            {level.labelTh}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { k: 'เท้าซ้าย', v: formatTemp(detail.left) },
            { k: 'เท้าขวา', v: formatTemp(detail.right) },
          ].map((cell) => (
            <div key={cell.k} className="rounded-2xl bg-white/80 px-2 py-2.5">
              <p className="text-[0.82rem] text-ink-soft">{cell.k}</p>
              <p className="text-[1.3rem] font-semibold tabular-nums leading-tight">{cell.v}</p>
            </div>
          ))}
          <div className="rounded-2xl px-2 py-2.5" style={{ backgroundColor: level.dot }}>
            <p className="text-[0.82rem] text-white/90">ผลต่าง</p>
            <p className="text-[1.3rem] font-semibold tabular-nums leading-tight text-white">
              {formatDiff(detail.diff)}°
            </p>
          </div>
        </div>

        <p className="mt-3 text-[0.95rem] leading-relaxed" style={{ color: level.ink }}>
          {detail.level === 'crit'
            ? `เท้า${hotFoot}ร้อนกว่าอีกข้าง ${detail.absDiff.toFixed(1)}°C เกินเกณฑ์ ${config.thresholdC}°C — เสี่ยงเกิดแผล`
            : detail.level === 'warn'
              ? `เท้า${hotFoot}เริ่มร้อนกว่าอีกข้าง ควรติดตามต่อเนื่อง`
              : 'อุณหภูมิสองข้างใกล้เคียงกัน ถือว่าปกติ'}
        </p>

        <button
          type="button"
          onClick={() => setTab('trend')}
          className="tap mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/90 px-4 text-[1rem] font-medium text-brand-600"
        >
          ดูกราฟแนวโน้ม 14 วันของจุดนี้ →
        </button>
      </section>

      <section className="card space-y-3">
        <h3 className="text-[1.1rem] font-semibold text-brand-700">ทั้ง 6 จุด</h3>
        <SensorList
          points={reading.points}
          selectedId={selectedPointId}
          onSelect={setSelectedPointId}
        />
        <Legend />
      </section>
    </div>
  )
}

export default FootMapScreen
