import { useId } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

interface RevenueChartProps {
  revenue: number[]
  years: string[]
  color: string
  height?: number
}

export function RevenueChart({
  revenue,
  years,
  color,
  height = 90,
}: RevenueChartProps) {
  const id = useId()
  const gradientId = `revenue-grad-${id.replace(/:/g, "")}`

  if (revenue.length < 2) return null

  const chartData = revenue.map((value, i) => ({
    year: years[i] ? `'${years[i].slice(-2)}` : `${i}`,
    value,
  }))

  return (
    <div>
      <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
        Revenue ($M)
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 9,
              fontFamily: "monospace",
              fill: "#94a3b8",
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null
              const { year, value } = payload[0].payload
              return (
                <div className="rounded-md border bg-card px-2 py-1 text-[10px] shadow-sm">
                  <span className="text-muted-foreground">{year}: </span>
                  <span className="font-mono font-semibold" style={{ color }}>
                    ${value.toLocaleString()}M
                  </span>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: "white", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
