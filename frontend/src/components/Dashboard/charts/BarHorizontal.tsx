import { cn } from "@/lib/utils"

interface BarHorizontalProps {
  value: number
  max?: number
  color?: string
  className?: string
}

export function BarHorizontal({
  value,
  max = 100,
  color,
  className,
}: BarHorizontalProps) {
  const pct = Math.min((value / max) * 100, 100)

  return (
    <div className={cn("h-[5px] w-full rounded-full bg-muted/50", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-600 ease-out"
        style={{
          width: `${pct}%`,
          backgroundColor: color ?? "hsl(var(--primary))",
        }}
      />
    </div>
  )
}
