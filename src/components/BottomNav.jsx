import Icon from './Icon.jsx'
import { useApp } from '../state/AppState.jsx'

const TABS = [
  { id: 'home', labelTh: 'หน้าหลัก', icon: 'home' },
  { id: 'map', labelTh: 'แผนที่เท้า', icon: 'foot' },
  { id: 'trend', labelTh: 'กราฟแนวโน้ม', icon: 'chart' },
  { id: 'alert', labelTh: 'แจ้งเตือน', icon: 'bell' },
]

const BottomNav = () => {
  const { tab, setTab, alert } = useApp()

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20 border-t border-brand-100 bg-white pb-1.5 pt-1">
      <ul className="flex">
        {TABS.map((item) => {
          const active = tab === item.id
          const showBadge = item.id === 'alert' && alert.active
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => setTab(item.id)}
                className={`tap flex w-full flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 ${
                  active ? 'text-brand-500' : 'text-ink-muted'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="relative leading-none" aria-hidden="true">
                  <Icon name={item.icon} size={26} strokeWidth={active ? 2.2 : 1.8} />
                  {showBadge && (
                    <span className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full bg-status-crit ring-2 ring-white" />
                  )}
                </span>
                <span className={`text-[0.78rem] ${active ? 'font-semibold' : 'font-normal'}`}>
                  {item.labelTh}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNav
