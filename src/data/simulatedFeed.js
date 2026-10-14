/**
 * Simulated sensor feed for the ThermoStep prototype.
 *
 * Nothing in the UI imports this file directly — everything goes through
 * `src/data/dataSource.js`, so this module can be replaced by a real
 * Bluetooth / cloud feed without touching a single screen.
 *
 * Clinical story encoded here (14 days, both feet, 6 points each):
 *   • Days 1–7   : both feet normal, left/right within 0.5 °C everywhere.
 *   • Days 8–14  : the RIGHT 1st metatarsal climbs steadily, 0.8 °C → 2.8 °C.
 *   • Days 12–14 : the difference sits at/above the 2.2 °C threshold for three
 *                  consecutive days → the early-warning alert fires on day 14.
 *   • Steps      : 7,000–9,000 on days 1–10 (the mechanical load that explains
 *                  the hot spot), then tapering as walking becomes harder.
 */
import { SENSOR_POINTS } from './sensorPoints.js'

export const SIM_CONFIG = {
  totalDays: 14,
  /** Red: a difference at or above this is an ulcer-risk hot spot. */
  thresholdC: 2.2,
  /** Yellow: watch zone. */
  warnC: 1.5,
  /** Consecutive days above threshold required before alerting. */
  consecutiveDaysForAlert: 3,
  stepGoal: 8000,
  restStepGoal: 3000,
  seeDoctorHours: 72,
}

/** Day 8 → day 14 left/right difference on the right 1st metatarsal (°C). */
const MET1_RAMP = {
  8: 0.8,
  9: 1.2,
  10: 1.6,
  11: 2.0,
  12: 2.3,
  13: 2.55,
  14: 2.8,
}

/** Deterministic PRNG — the demo must replay identically every time. */
const seededRandom = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

const hashKey = (key) => {
  let h = 2166136261
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Stable pseudo-random value in [-1, 1] for a given label. */
const jitter = (key) => seededRandom(hashKey(key))() * 2 - 1

const round1 = (n) => Math.round(n * 10) / 10

export const classifyDiff = (diff) => {
  const d = Math.abs(diff)
  if (d >= SIM_CONFIG.thresholdC) return 'crit'
  if (d >= SIM_CONFIG.warnC) return 'warn'
  return 'good'
}

const stepsForDay = (day) => {
  const wobble = jitter(`steps-${day}`)
  if (day <= 10) {
    // Active phase: 7,000–9,000 steps/day keeps loading the forefoot.
    return Math.round(8000 + wobble * 1000)
  }
  // Load drops off as the foot gets warmer and walking gets uncomfortable.
  const taper = [6600, 5900, 5200, 4600][day - 11]
  return Math.round(taper + wobble * 250)
}

/** Whole-foot ambient drift: weather, activity, time of measurement. */
const dayDrift = (day) => round1(jitter(`drift-${day}`) * 0.35)

const buildDay = (day, todayIso) => {
  const date = new Date(todayIso)
  date.setDate(date.getDate() - (SIM_CONFIG.totalDays - day))

  const points = SENSOR_POINTS.map((point) => {
    const left = round1(point.baselineC + dayDrift(day) + jitter(`L-${point.id}-${day}`) * 0.3)

    // Natural asymmetry between twin spots: always inside ±0.5 °C.
    let signedDiff = round1(jitter(`D-${point.id}-${day}`) * 0.4)

    if (point.id === 'met1' && day >= 8) {
      // The developing hot spot. Exact ramp values keep the demo crisp.
      signedDiff = MET1_RAMP[day]
    }

    // Derive right from the rounded left so the displayed numbers always add up.
    const right = round1(left + signedDiff)
    const diff = round1(right - left)

    return {
      id: point.id,
      left,
      right,
      /** Signed: positive means the RIGHT foot is hotter. */
      diff,
      absDiff: Math.abs(diff),
      hotterFoot: diff > 0 ? 'right' : diff < 0 ? 'left' : 'none',
      level: classifyDiff(diff),
    }
  })

  return {
    day,
    dateIso: date.toISOString().slice(0, 10),
    steps: stepsForDay(day),
    points,
  }
}

/** The full simulated dataset: 14 days × 2 feet × 6 points. */
export const generateHistory = (todayIso = new Date().toISOString().slice(0, 10)) =>
  Array.from({ length: SIM_CONFIG.totalDays }, (_, i) => buildDay(i + 1, todayIso))
