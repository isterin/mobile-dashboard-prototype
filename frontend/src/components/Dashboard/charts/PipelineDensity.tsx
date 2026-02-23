interface PipelinePhase {
  label: string
  value: number
  color: string
}

interface PipelineDensityProps {
  phases: PipelinePhase[]
}

export function PipelineDensity({ phases }: PipelineDensityProps) {
  const total = phases.reduce((sum, p) => sum + (p.value ?? 0), 0)
  if (total === 0) return null

  return (
    <div>
      {/* Stacked bar */}
      <div className="flex h-3 gap-px overflow-hidden rounded-md">
        {phases.map((p) => {
          const pct = ((p.value ?? 0) / total) * 100
          if (pct === 0) return null
          return (
            <div
              key={p.label}
              className="min-w-1 transition-[width] duration-600 ease-out"
              style={{ width: `${pct}%`, backgroundColor: p.color }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
        {phases.map((p) => (
          <div key={p.label} className="flex items-center gap-1.5">
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-[10px] text-muted-foreground">{p.label}</span>
            <span
              className="font-mono text-[10px] font-semibold"
              style={{ color: p.color }}
            >
              {p.value ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
