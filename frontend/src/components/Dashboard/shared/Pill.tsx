import { cn } from "@/lib/utils"

interface PillProps {
  children: React.ReactNode
  variant?: "blue" | "green" | "red" | "yellow" | "purple" | "pink"
  className?: string
}

const variantStyles: Record<string, string> = {
  blue: "text-blue-600 bg-blue-600/8",
  green: "text-green-600 bg-green-600/8",
  red: "text-red-600 bg-red-600/8",
  yellow: "text-yellow-600 bg-yellow-600/8",
  purple: "text-purple-600 bg-purple-600/8",
  pink: "text-pink-600 bg-pink-600/8",
}

export function Pill({ children, variant = "blue", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-block rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wide",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
