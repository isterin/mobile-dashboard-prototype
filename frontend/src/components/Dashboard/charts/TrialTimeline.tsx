import { CheckCircleIcon } from "lucide-react"

import type { TrialWithCompound } from "@/client"

interface TrialTimelineProps {
  trials: TrialWithCompound[]
}

const velocityColor = (v: string | null | undefined) =>
  v === "fast" ? "#009E73" : v === "moderate" ? "#E69F00" : "#D55E00"

export function TrialTimeline({ trials }: TrialTimelineProps) {
  // Group by primary completion date
  const groups = new Map<string, TrialWithCompound[]>()
  for (const t of trials) {
    const pcd = t.primary_completion_date ?? "Unknown"
    if (!groups.has(pcd)) groups.set(pcd, [])
    groups.get(pcd)?.push(t)
  }

  // Sort: "Completed" first, then chronologically
  const sorted = [...groups.keys()].sort((a, b) => {
    if (a === "Completed") return -1
    if (b === "Completed") return 1
    return a.localeCompare(b)
  })

  // Sort trials within each group by enrollment % descending
  for (const key of sorted) {
    groups
      .get(key)
      ?.sort(
        (a, b) =>
          (b.current_enrollment_pct ?? 0) - (a.current_enrollment_pct ?? 0),
      )
  }

  return (
    <div className="relative ml-[68px]">
      {/* Vertical line */}
      <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#e2e8f0]" />

      {sorted.map((quarter, qi) => {
        const groupTrials = groups.get(quarter) ?? []
        const isCompleted = quarter === "Completed"
        const isLast = qi === sorted.length - 1

        return (
          <div key={quarter} className={isLast ? "" : "mb-4"}>
            {/* Quarter label + node */}
            <div className="relative flex items-center">
              {/* Quarter label — positioned left of the line */}
              <div className="absolute right-full mr-3 whitespace-nowrap font-mono text-[10px] font-semibold text-muted-foreground">
                {quarter}
              </div>

              {/* Node dot on the line */}
              {isCompleted ? (
                <div className="relative -left-[5px] z-10">
                  <CheckCircleIcon
                    className="h-[11px] w-[11px]"
                    style={{ color: "#009E73" }}
                  />
                </div>
              ) : (
                <div
                  className="relative -left-[4px] z-10 h-[9px] w-[9px] rounded-full border-2 border-white"
                  style={{
                    backgroundColor: velocityColor(
                      groupTrials[0]?.enrollment_velocity,
                    ),
                  }}
                />
              )}
            </div>

            {/* Trial entries */}
            {groupTrials.map((t) => {
              const pct = t.current_enrollment_pct ?? 0
              const color = velocityColor(t.enrollment_velocity)
              return (
                <div key={t.id} className="ml-4 mt-1.5 mb-2">
                  {/* Top line: compound name + enrollment % */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0 truncate text-xs font-medium">
                      {t.compound_brand_name} &mdash; {t.trial_name}
                    </div>
                    {!isCompleted ? (
                      <span
                        className="shrink-0 font-mono text-[10px] font-semibold"
                        style={{ color }}
                      >
                        {pct}%
                      </span>
                    ) : (
                      <span className="shrink-0 font-mono text-[10px] font-semibold text-[#009E73]">
                        100%
                      </span>
                    )}
                  </div>

                  {/* Second line: metadata + "enrolled" label */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-[10px] text-muted-foreground/60">
                      {t.compound_sponsor} &middot; {t.phase} &middot; n=
                      {t.target_enrollment}
                    </div>
                    <span className="shrink-0 text-[9px] text-muted-foreground/40">
                      {isCompleted ? "complete" : "enrolled"}
                    </span>
                  </div>

                  {/* Enrollment bar (CSS) */}
                  {!isCompleted && (
                    <div className="mt-1 h-1 w-full rounded-full bg-[#e2e8f0]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
