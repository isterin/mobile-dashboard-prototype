import { useId } from "react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
}

export function Sparkline({
  data,
  color = "#2563eb",
  height = 28,
}: SparklineProps) {
  const id = useId()

  if (data.length < 2) return <div style={{ width: "100%", height }} />

  const chartData = data.map((value, index) => ({ index, value }))
  const gradientId = `sparkline-grad-${id.replace(/:/g, "")}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 2, right: 2, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 2.5, fill: color, stroke: "none" }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
