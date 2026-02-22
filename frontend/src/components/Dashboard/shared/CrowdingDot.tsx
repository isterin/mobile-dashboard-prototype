import { cn } from "@/lib/utils"

interface CrowdingDotProps {
  level: string
  className?: string
}

const levelColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
}

export function CrowdingDot({ level, className }: CrowdingDotProps) {
  return (
    <span
      className={cn(
        "inline-block h-[7px] w-[7px] shrink-0 rounded-full",
        levelColors[level] ?? "bg-gray-400",
        className,
      )}
    />
  )
}
