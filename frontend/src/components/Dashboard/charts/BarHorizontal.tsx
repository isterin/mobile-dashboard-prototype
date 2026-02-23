import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts"
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
  const chartData = [{ value: Math.min(value, max), max }]
  const fillColor = color ?? "hsl(var(--primary))"

  return (
    <div className={cn("h-[5px] w-full", className)}>
      <ResponsiveContainer width="100%" height={5}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          barCategoryGap={0}
        >
          <XAxis type="number" domain={[0, max]} hide />
          <Bar
            dataKey="value"
            radius={[3, 3, 3, 3]}
            isAnimationActive={false}
            background={{ fill: "hsl(var(--muted) / 0.5)", radius: 3 }}
          >
            <Cell fill={fillColor} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
