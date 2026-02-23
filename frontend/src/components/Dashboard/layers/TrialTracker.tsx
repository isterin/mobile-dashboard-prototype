import type { DashboardPublic } from "@/client"

import { TrialTimeline } from "../charts/TrialTimeline"
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

  const velocityColor = (v: string | null | undefined) =>
    v === "fast" ? "#009E73" : v === "moderate" ? "#E69F00" : "#D55E00"

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
              color: "#009E73",
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
        <TrialTimeline trials={data.trials} />
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
              <span
                className="font-mono text-[10px] font-semibold"
                style={{ color: velocityColor(t.enrollment_velocity) }}
              >
                {t.current_enrollment_pct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#e2e8f0]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${t.current_enrollment_pct ?? 0}%`,
                  backgroundColor: velocityColor(t.enrollment_velocity),
                }}
              />
            </div>
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
