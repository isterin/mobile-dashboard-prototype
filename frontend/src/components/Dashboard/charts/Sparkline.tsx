interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

export function Sparkline({
  data,
  color = "#2563eb",
  width = 72,
  height = 28,
}: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const last = data[data.length - 1]

  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`,
    )
    .join(" ")

  const gradientId = `sg-${color.replace(/[^a-zA-Z0-9]/g, "")}`

  return (
    <svg
      width={width}
      height={height}
      style={{ display: "block" }}
      role="img"
      aria-label="Sparkline chart"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={width}
        cy={height - ((last - min) / range) * (height - 4) - 2}
        r="2.5"
        fill={color}
      />
    </svg>
  )
}
