/**
 * The 6 sensor points of one ThermoStep insole.
 *
 * `x` / `y` are coordinates inside the LEFT-foot SVG viewBox ("0 0 100 210",
 * toes up, big toe on the right/medial side). The right foot re-uses the same
 * geometry mirrored, so one set of numbers drives both diagrams.
 */
export const SENSOR_POINTS = [
  {
    id: 'hallux',
    labelTh: 'นิ้วโป้งเท้า',
    shortTh: 'นิ้วโป้ง',
    labelEn: 'Hallux',
    x: 70,
    y: 40,
    /** Baseline plantar skin temperature (°C) used by the simulator. */
    baselineC: 29.8,
  },
  {
    id: 'met1',
    labelTh: 'โคนนิ้วโป้ง (ฝ่าเท้าที่ 1)',
    shortTh: 'โคนนิ้วโป้ง',
    labelEn: '1st metatarsal',
    x: 70,
    y: 78,
    baselineC: 31.2,
  },
  {
    id: 'met3',
    labelTh: 'ฝ่าเท้ากลาง (จุดที่ 3)',
    shortTh: 'ฝ่าเท้าที่ 3',
    labelEn: '3rd metatarsal',
    x: 54,
    y: 84,
    baselineC: 31.0,
  },
  {
    id: 'met5',
    labelTh: 'ฝ่าเท้าด้านนอก (จุดที่ 5)',
    shortTh: 'ฝ่าเท้าที่ 5',
    labelEn: '5th metatarsal',
    x: 36,
    y: 92,
    baselineC: 30.4,
  },
  {
    id: 'midfoot',
    labelTh: 'กลางเท้า',
    shortTh: 'กลางเท้า',
    labelEn: 'Midfoot',
    x: 46,
    y: 130,
    baselineC: 30.6,
  },
  {
    id: 'heel',
    labelTh: 'ส้นเท้า',
    shortTh: 'ส้นเท้า',
    labelEn: 'Heel',
    x: 50,
    y: 172,
    baselineC: 29.2,
  },
]

export const SENSOR_POINT_IDS = SENSOR_POINTS.map((p) => p.id)

export const getSensorPoint = (id) => SENSOR_POINTS.find((p) => p.id === id)
