const ScreenHeader = ({ title, subtitle }) => (
  <header className="pt-1">
    <h2 className="text-[1.5rem] font-semibold leading-tight text-brand-700">{title}</h2>
    {subtitle && <p className="mt-0.5 text-[0.92rem] text-ink-soft">{subtitle}</p>}
  </header>
)

export default ScreenHeader
