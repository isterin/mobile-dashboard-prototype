interface FunnelBarProps {
  label: string
  value: number
  total: number
  color: string
  unit?: string
}

export function FunnelBar({
  label,
  value,
  total,
  color,
  unit = "",
}: FunnelBarProps) {
  const pct = (value / total) * 100

  return (
    <div className="mb-2.5">
      <div className="mb-1 flex justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="font-mono text-xs font-semibold" style={{ color }}>
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 w-full rounded bg-muted/50">
        <div
          className="h-full rounded opacity-85 transition-[width] duration-800 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
