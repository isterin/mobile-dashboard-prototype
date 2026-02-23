import type { DashboardPublic } from "@/client"

import { BarHorizontal } from "../charts/BarHorizontal"
import { AiAssessmentBox } from "../shared/AiAssessmentBox"
import { Pill } from "../shared/Pill"

interface TrialTrackerProps {
  data: DashboardPublic
}

export function TrialTracker({ data }: TrialTrackerProps) {
  const aiAssessment = data.ai_assessments.find((a) => a.layer === 3)
  const enrolling = data.trials.filter((t) => t.status === "Enrolling")
  const fastCount = data.trials.filter(
    (t) => t.enrollment_velocity === "fast",
  ).length
  const totalPatients = data.trials.reduce(
    (a, t) => a + (t.target_enrollment ?? 0),
    0,
  )

  // Group by primary completion date quarter
  const pcdGroups = new Map<string, typeof data.trials>()
  for (const t of data.trials) {
    const pcd = t.primary_completion_date ?? "Unknown"
    if (!pcdGroups.has(pcd)) pcdGroups.set(pcd, [])
    pcdGroups.get(pcd)?.push(t)
  }
  // Sort quarters chronologically
  const sortedPcds = [...pcdGroups.keys()].sort()

  const velocityColor = (v: string | null | undefined) =>
    v === "fast" ? "#16a34a" : v === "moderate" ? "#ca8a04" : "#dc2626"

  return (
    <div className="space-y-3">
      {/* Enrollment Snapshot */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Enrollment Snapshot
        </div>
        <div className="flex justify-around gap-3.5">
          {[
            {
              label: "Active Trials",
              value: enrolling.length,
              color: "#2563eb",
            },
            {
              label: "Total Patients",
              value: totalPatients.toLocaleString(),
              color: "#7c3aed",
            },
            {
              label: "Fast Enrolling",
              value: fastCount,
              color: "#16a34a",
            },
          ].map((k) => (
            <div key={k.label} className="text-center">
              <div
                className="font-mono text-[22px] font-bold"
                style={{ color: k.color }}
              >
                {k.value}
              </div>
              <div className="mt-0.5 text-[9px] text-muted-foreground/60">
                {k.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline by Quarter */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Expected Primary Completion
        </div>
        {sortedPcds.map((q) => {
          const trials = pcdGroups.get(q) ?? []
          return (
            <div key={q} className="mb-3.5">
              <div className="mb-1.5 font-mono text-[11px] font-semibold text-blue-600">
                {q}
              </div>
              {trials.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 border-b py-1.5"
                >
                  <div
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: velocityColor(t.enrollment_velocity),
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">
                      {t.compound_brand_name} &mdash; {t.trial_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60">
                      {t.compound_sponsor}
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    n={t.target_enrollment}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Trial Detail Cards */}
      {enrolling.map((t) => (
        <div key={t.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-2.5 flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold">
                {t.compound_brand_name}
              </div>
              <div className="text-[10px] text-muted-foreground/60">
                {t.trial_name} &middot; {t.compound_sponsor}
              </div>
            </div>
            <Pill
              variant={
                t.enrollment_velocity === "fast"
                  ? "green"
                  : t.enrollment_velocity === "moderate"
                    ? "yellow"
                    : "red"
              }
            >
              {t.enrollment_velocity ?? "—"}
            </Pill>
          </div>

          {/* Enrollment bar */}
          <div className="mb-2.5">
            <div className="mb-1 flex justify-between">
              <span className="text-[10px] text-muted-foreground/60">
                Enrollment
              </span>
              <span className="font-mono text-[10px] font-semibold">
                {t.current_enrollment_pct}%
              </span>
            </div>
            <BarHorizontal
              value={t.current_enrollment_pct ?? 0}
              color={velocityColor(t.enrollment_velocity)}
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div>
              <span className="text-muted-foreground/60">Phase</span>
              <div className="mt-0.5 text-muted-foreground">{t.phase}</div>
            </div>
            <div>
              <span className="text-muted-foreground/60">N</span>
              <div className="mt-0.5 font-mono text-muted-foreground">
                {t.target_enrollment}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground/60">Primary Endpoint</span>
              <div className="mt-0.5 text-muted-foreground">
                {t.primary_endpoint ?? "—"}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground/60">Comparator</span>
              <div className="mt-0.5 text-muted-foreground">
                {t.comparator ?? "—"}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground/60">PCD</span>
              <div className="mt-0.5 font-mono font-medium text-blue-600">
                {t.primary_completion_date ?? "—"}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* AI Assessment */}
      {aiAssessment && (
        <AiAssessmentBox>
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: AI assessment content is from our backend
            dangerouslySetInnerHTML={{ __html: aiAssessment.content }}
          />
        </AiAssessmentBox>
      )}
    </div>
  )
}
