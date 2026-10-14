/**
 * THE ONLY DATA DOOR IN THE APP.
 *
 * Every screen reads sensor data through this module. Swapping the simulated
 * feed for real hardware means writing one object with the same shape (see
 * `DataSource` below) and handing it to `setDataSource()` — no screen changes.
 *
 *   // future: src/data/bleDataSource.js
 *   setDataSource(createBleDataSource({ deviceId }))
 *
 * Contract
 *   getConfig()              → thresholds, step goals
 *   getSensorPoints()        → the 6 insole points + diagram geometry
 *   getTotalDays()           → how many days of history exist
 *   getLatestDay()           → day number of the newest reading
 *   getHistory()             → every day, ascending
 *   getDay(day)              → one day's reading set
 *   getPointReading(day, id) → one twin-pair comparison
 *   getSeries(id, upToDay?)  → 14-day difference series for the trend chart
 *   getAlert(day)            → early-warning state as of that day
 *   subscribe(listener)      → live updates; returns an unsubscribe function
 */
import { SENSOR_POINTS, getSensorPoint } from './sensorPoints.js'
import { SIM_CONFIG, classifyDiff, generateHistory } from './simulatedFeed.js'

const createSimulatedDataSource = () => {
  const history = generateHistory()

  const getDay = (day) => history.find((d) => d.day === day) ?? history[history.length - 1]

  const getPointReading = (day, pointId) =>
    getDay(day).points.find((p) => p.id === pointId) ?? null

  const getSeries = (pointId, upToDay = SIM_CONFIG.totalDays) =>
    history
      .filter((d) => d.day <= upToDay)
      .map((d) => {
        const reading = d.points.find((p) => p.id === pointId)
        return {
          day: d.day,
          dateIso: d.dateIso,
          left: reading.left,
          right: reading.right,
          diff: reading.diff,
          absDiff: reading.absDiff,
          level: reading.level,
          steps: d.steps,
        }
      })

  /**
   * Early-warning rule: the same twin pair at/above the threshold for
   * `consecutiveDaysForAlert` days in a row, counting back from `day`.
   */
  const getAlert = (day = SIM_CONFIG.totalDays) => {
    let worst = null

    for (const point of SENSOR_POINTS) {
      const series = getSeries(point.id, day)
      let streak = 0
      for (let i = series.length - 1; i >= 0; i -= 1) {
        if (series[i].absDiff >= SIM_CONFIG.thresholdC) streak += 1
        else break
      }
      const today = series[series.length - 1]
      const candidate = {
        pointId: point.id,
        pointLabelTh: point.labelTh,
        pointShortTh: point.shortTh,
        streak,
        diff: today.diff,
        absDiff: today.absDiff,
        hotterFoot: today.diff > 0 ? 'right' : 'left',
        level: today.level,
        sinceDay: streak > 0 ? today.day - streak + 1 : null,
        active: streak >= SIM_CONFIG.consecutiveDaysForAlert,
      }
      if (!worst || candidate.streak > worst.streak || candidate.absDiff > worst.absDiff) {
        if (!worst || candidate.streak > worst.streak) worst = candidate
        else if (candidate.streak === worst.streak && candidate.absDiff > worst.absDiff) worst = candidate
      }
    }

    return worst
  }

  return {
    kind: 'simulated',
    getConfig: () => ({ ...SIM_CONFIG }),
    getSensorPoints: () => SENSOR_POINTS,
    getSensorPoint,
    getTotalDays: () => history.length,
    getLatestDay: () => history[history.length - 1].day,
    getHistory: () => history,
    getDay,
    getPointReading,
    getSeries,
    getAlert,
    classifyDiff,
    /** No-op for the simulated feed; a real feed pushes here on every packet. */
    subscribe: () => () => {},
  }
}

let activeSource = createSimulatedDataSource()

/** Replace the feed (e.g. real insole over Bluetooth) at app start-up. */
export const setDataSource = (source) => {
  activeSource = source
}

export const dataSource = {
  get kind() {
    return activeSource.kind
  },
  getConfig: (...a) => activeSource.getConfig(...a),
  getSensorPoints: (...a) => activeSource.getSensorPoints(...a),
  getSensorPoint: (...a) => activeSource.getSensorPoint(...a),
  getTotalDays: (...a) => activeSource.getTotalDays(...a),
  getLatestDay: (...a) => activeSource.getLatestDay(...a),
  getHistory: (...a) => activeSource.getHistory(...a),
  getDay: (...a) => activeSource.getDay(...a),
  getPointReading: (...a) => activeSource.getPointReading(...a),
  getSeries: (...a) => activeSource.getSeries(...a),
  getAlert: (...a) => activeSource.getAlert(...a),
  classifyDiff: (...a) => activeSource.classifyDiff(...a),
  subscribe: (...a) => activeSource.subscribe(...a),
}

export { createSimulatedDataSource }
