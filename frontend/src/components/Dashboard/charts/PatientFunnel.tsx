import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

interface FunnelStage {
  label: string
  value: number
  color: string
  unit?: string
}

interface PatientFunnelProps {
  stages: FunnelStage[]
  total: number
}

export function PatientFunnel({ stages, total }: PatientFunnelProps) {
  const chartData = stages.map((s, i) => ({
    name: s.label,
    value: s.value,
    color: s.color,
    unit: s.unit ?? "",
    idx: i,
  }))

  return (
    <ResponsiveContainer width="100%" height={stages.length * 40 + 8}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 4, bottom: 0, left: 0 }}
        barCategoryGap="20%"
      >
        <XAxis type="number" domain={[0, total]} hide />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <Bar
          dataKey="value"
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
          label={{
            position: "right",
            fontSize: 11,
            fontFamily: "monospace",
            fontWeight: 600,
            content: ({ x, y, width: w, height: h, index }) => {
              const entry = chartData[index as number]
              if (!entry) return null
              return (
                <text
                  x={(x as number) + (w as number) + 6}
                  y={(y as number) + (h as number) / 2}
                  dominantBaseline="central"
                  fontSize={11}
                  fontFamily="monospace"
                  fontWeight={600}
                  fill={entry.color}
                >
                  {entry.value}
                  {entry.unit}
                </text>
              )
            },
          }}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
