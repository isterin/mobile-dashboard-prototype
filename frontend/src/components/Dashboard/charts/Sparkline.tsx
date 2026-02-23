import { useEffect, useId, useRef, useState } from "react"

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const w = el.getBoundingClientRect().width
      if (w > 0) setWidth(w)
    }
    measure()

    const observer = new ResizeObserver(() => measure())
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (data.length < 2) return <div ref={containerRef} style={{ width: "100%" }} />

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

  const gradientId = `sparkline-grad-${id}`

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {width > 0 && (
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
      )}
    </div>
  )
}
