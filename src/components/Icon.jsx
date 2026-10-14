/** Line icons — a cleaner medical read than emoji in the chrome. */
const paths = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  chart: 'M4 19V5m0 14h16M7.5 15l3.5-4 3 2.5L19 7',
  bell: 'M12 3a5.5 5.5 0 0 0-5.5 5.5c0 4-1.5 5.5-1.5 5.5h14s-1.5-1.5-1.5-5.5A5.5 5.5 0 0 0 12 3Zm-2 14a2 2 0 0 0 4 0',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3m2-4h12',
  play: 'M8 5.5v13l10-6.5z',
  thermometer: 'M12 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z',
}

/** Icons whose glyph reads better as a solid shape. */
const SOLID = new Set(['play'])

/** Footprint needs more than one shape, so it is drawn rather than pathed. */
const Footprint = ({ strokeWidth }) => (
  <g fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M7.6 20.4c3 0 4.6-1.8 4.6-4.4 0-2.2-1.3-3.4-1.3-5.4 0-1.1.3-1.9.3-1.9-1.8-.5-4.1-.2-5.6 1.1-1.1 1-1.6 2.3-1.6 3.9 0 1.9.6 2.9.6 4.2 0 1.6 1.1 2.5 3 2.5Z" />
    <circle cx="6.1" cy="5.9" r="1.5" />
    <circle cx="10.4" cy="4.6" r="1.6" />
    <circle cx="14.6" cy="5.2" r="1.7" />
    <circle cx="17.9" cy="7.6" r="1.6" />
  </g>
)

const Icon = ({ name, size = 24, className = '', filled = SOLID.has(name), strokeWidth = 1.9 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {name === 'foot' ? <Footprint strokeWidth={strokeWidth} /> : <path d={paths[name]} />}
  </svg>
)

export default Icon
