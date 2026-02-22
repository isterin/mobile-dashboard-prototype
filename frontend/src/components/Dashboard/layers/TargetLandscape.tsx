import type { DashboardPublic } from "@/client"

import { AiAssessmentBox } from "../shared/AiAssessmentBox"
import { CrowdingDot } from "../shared/CrowdingDot"
import { Pill } from "../shared/Pill"

interface TargetLandscapeProps {
  data: DashboardPublic
}

export function TargetLandscape({ data }: TargetLandscapeProps) {
  const aiAssessment = data.ai_assessments.find((a) => a.layer === 2)

  return (
    <div className="space-y-3">
      {/* Mechanism Map */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Mechanism of Action Landscape
        </div>
        <div className="mb-3.5 text-xs leading-normal text-muted-foreground">
          Targets being pursued in {data.indication.name}, grouped by class.
          Bubble size indicates number of compounds.
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {data.targets.map((t) => {
            const size = 38 + (t.compound_count ?? 0) * 12
            const bgClass =
              t.crowding === "high"
                ? "bg-red-500/7 border-red-500/12"
                : t.crowding === "medium"
                  ? "bg-yellow-500/8 border-yellow-500/20"
                  : "bg-blue-600/8 border-blue-600/18"
            return (
              <div
                key={t.id}
                className={`flex shrink-0 flex-col items-center justify-center rounded-full border ${bgClass}`}
                style={{ width: size, height: size }}
              >
                <div className="text-center font-mono text-[8px] font-bold leading-tight">
                  {t.name}
                </div>
                <div className="mt-px text-[8px] text-muted-foreground/60">
                  {t.compound_count}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Target Detail Cards */}
      {data.targets.map((t) => (
        <div key={t.id} className="rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CrowdingDot level={t.crowding} />
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-[10px] text-muted-foreground/60">
                  {t.target_class}
                </div>
              </div>
            </div>
            <Pill variant={t.has_marketed_drug ? "green" : "blue"}>
              {t.most_advanced_phase}
            </Pill>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {t.compound_count ?? 0} compound
              {(t.compound_count ?? 0) > 1 ? "s" : ""}
            </span>
            <span
              className={`text-[9px] font-semibold uppercase tracking-wide ${
                t.crowding === "high"
                  ? "text-red-500"
                  : t.crowding === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}
            >
              {t.crowding} competition
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(t.drug_names ?? []).map((name) => (
              <span
                key={name}
                className="rounded bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {name}
              </span>
            ))}
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
