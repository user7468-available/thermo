import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { dataSource } from '../data/dataSource.js'

/** 14 days in ~29 s — sized for a 30-second demo clip. */
export const DEMO_DAY_MS = 2050

const AppStateContext = createContext(null)

export const AppStateProvider = ({ children }) => {
  const config = useMemo(() => dataSource.getConfig(), [])
  const totalDays = useMemo(() => dataSource.getTotalDays(), [])
  const latestDay = useMemo(() => dataSource.getLatestDay(), [])

  const [tab, setTab] = useState('home')
  const [selectedPointId, setSelectedPointId] = useState('met1')
  const [demo, setDemo] = useState({ active: false, playing: false, day: 1 })
  const [restMode, setRestMode] = useState({ active: false, endsAt: null })
  const [caregiver, setCaregiver] = useState({ status: 'idle', at: null })
  const [alertOverlay, setAlertOverlay] = useState(false)
  const [lastCheckDay, setLastCheckDay] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  /** The day every screen renders: the demo cursor while demoing, else today. */
  const viewDay = demo.active ? demo.day : latestDay

  const reading = useMemo(() => dataSource.getDay(viewDay), [viewDay])
  const alert = useMemo(() => dataSource.getAlert(viewDay), [viewDay])
  const series = useMemo(
    () => dataSource.getSeries(selectedPointId, viewDay),
    [selectedPointId, viewDay],
  )

  const stepGoal = restMode.active ? config.restStepGoal : config.stepGoal

  // ---- demo playback -------------------------------------------------------
  const startDemo = useCallback(() => {
    setDemo({ active: true, playing: true, day: 1 })
    setAlertOverlay(false)
    setSelectedPointId('met1')
    setTab('map')
  }, [])

  const pauseDemo = useCallback(() => setDemo((d) => ({ ...d, playing: false })), [])
  const resumeDemo = useCallback(
    () => setDemo((d) => ({ ...d, playing: true, day: d.day >= totalDays ? 1 : d.day })),
    [totalDays],
  )
  const resetDemo = useCallback(() => {
    setDemo({ active: true, playing: false, day: 1 })
    setAlertOverlay(false)
  }, [])
  const exitDemo = useCallback(() => {
    setDemo({ active: false, playing: false, day: 1 })
    setAlertOverlay(false)
  }, [])
  const seekDemo = useCallback(
    (day) => setDemo((d) => ({ ...d, active: true, day: Math.min(totalDays, Math.max(1, day)) })),
    [totalDays],
  )

  useEffect(() => {
    if (!demo.active || !demo.playing) return undefined
    const id = setInterval(() => {
      setDemo((d) => {
        if (d.day >= totalDays) return { ...d, playing: false }
        return { ...d, day: d.day + 1 }
      })
    }, DEMO_DAY_MS)
    return () => clearInterval(id)
  }, [demo.active, demo.playing, totalDays])

  // ---- the alert fires by itself the day the rule is met -------------------
  const prevAlertActive = useRef(alert.active)
  useEffect(() => {
    const wasActive = prevAlertActive.current
    prevAlertActive.current = alert.active
    if (alert.active && !wasActive) {
      setAlertOverlay(true)
      setDemo((d) => (d.active ? { ...d, playing: false } : d))
    }
    if (!alert.active && wasActive) setAlertOverlay(false)
  }, [alert.active])

  // ---- rest mode countdown ------------------------------------------------
  const enableRestMode = useCallback(() => {
    setRestMode({ active: true, endsAt: Date.now() + config.seeDoctorHours * 3600 * 1000 })
  }, [config.seeDoctorHours])

  const disableRestMode = useCallback(() => setRestMode({ active: false, endsAt: null }), [])

  useEffect(() => {
    if (!restMode.active) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [restMode.active])

  const restMsLeft = restMode.endsAt ? Math.max(0, restMode.endsAt - now) : 0

  // ---- caregiver notification (simulated) ---------------------------------
  const notifyCaregiver = useCallback(() => {
    setCaregiver({ status: 'sending', at: null })
    setTimeout(() => setCaregiver({ status: 'sent', at: new Date() }), 1400)
  }, [])

  const value = {
    config,
    totalDays,
    latestDay,
    viewDay,
    reading,
    alert,
    series,
    stepGoal,
    tab,
    setTab,
    selectedPointId,
    setSelectedPointId,
    demo,
    startDemo,
    pauseDemo,
    resumeDemo,
    resetDemo,
    exitDemo,
    seekDemo,
    restMode,
    restMsLeft,
    enableRestMode,
    disableRestMode,
    caregiver,
    notifyCaregiver,
    alertOverlay,
    openAlertOverlay: () => setAlertOverlay(true),
    closeAlertOverlay: () => setAlertOverlay(false),
    lastCheckDay,
    recordFootCheck: () => setLastCheckDay(viewDay),
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useApp must be used inside <AppStateProvider>')
  return ctx
}
