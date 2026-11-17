export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder,
  className = '',
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value
          const labelText = typeof opt === 'string' ? opt : opt.label
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          )
        })}
      </select>
    </div>
  )
}
