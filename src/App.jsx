import AlertView from './components/AlertView.jsx'
import Icon from './components/Icon.jsx'
import BottomNav from './components/BottomNav.jsx'
import DemoController from './components/DemoController.jsx'
import AlertScreen from './screens/AlertScreen.jsx'
import FootMapScreen from './screens/FootMapScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import TrendScreen from './screens/TrendScreen.jsx'
import { AppStateProvider, useApp } from './state/AppState.jsx'

const SCREENS = {
  home: HomeScreen,
  map: FootMapScreen,
  trend: TrendScreen,
  alert: AlertScreen,
}

const AppBar = () => {
  const { demo, viewDay, alert } = useApp()
  return (
    <header className="z-20 flex items-center justify-between border-b border-brand-100 bg-white px-5 pb-2.5 pt-3">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white" aria-hidden="true">
          <Icon name="thermometer" size={20} />
        </span>
        <div>
          <p className="text-[1.15rem] font-semibold leading-none text-brand-700">ThermoStep</p>
          <p className="text-[0.74rem] text-ink-muted">แผ่นรองเท้าอัจฉริยะ · 12 เซ็นเซอร์</p>
        </div>
      </div>
      <span
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.74rem] font-medium ${
          demo.active ? 'bg-brand-500 text-white' : 'bg-status-good-bg text-status-good-ink'
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${demo.active ? 'bg-white' : 'bg-status-good'}`} aria-hidden="true" />
        {demo.active ? `สาธิต วันที่ ${viewDay}` : 'เชื่อมต่อแล้ว'}
      </span>
    </header>
  )
}

const Shell = () => {
  const { tab, alertOverlay } = useApp()
  const Screen = SCREENS[tab] ?? HomeScreen

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <AppBar />
      <main key={tab} className="animate-rise flex-1 overflow-y-auto px-5 pb-[150px] pt-4 no-scrollbar">
        <Screen />
      </main>
      {!alertOverlay && <DemoController />}
      <BottomNav />
      {alertOverlay && <AlertView variant="overlay" />}
    </div>
  )
}

/** Phone chrome so the prototype reads as a 390×844 device on a laptop. */
const PhoneFrame = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-brand-50 p-0 sm:bg-brand-700 sm:p-6">
    <div className="h-[100dvh] w-full overflow-hidden bg-white sm:h-[844px] sm:w-[390px] sm:rounded-[2.6rem] sm:border-[10px] sm:border-brand-900 sm:shadow-2xl">
      {children}
    </div>
  </div>
)

const App = () => (
  <AppStateProvider>
    <PhoneFrame>
      <Shell />
    </PhoneFrame>
  </AppStateProvider>
)

export default App
