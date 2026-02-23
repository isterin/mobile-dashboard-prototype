import { cn } from "@/lib/utils"

interface CrowdingDotProps {
  level: string
  className?: string
}

const levelColors: Record<string, string> = {
  high: "#D55E00",
  medium: "#56B4E9",
  low: "#009E73",
}

export function CrowdingDot({ level, className }: CrowdingDotProps) {
  return (
    <span
      className={cn(
        "inline-block h-[7px] w-[7px] shrink-0 rounded-full",
        className,
      )}
      style={{ backgroundColor: levelColors[level] ?? "#9ca3af" }}
    />
  )
}
