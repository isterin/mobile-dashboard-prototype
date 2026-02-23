import { ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import type { DashboardPublic } from "@/client"

import { AiAssessmentBox } from "../shared/AiAssessmentBox"
import { CrowdingDot } from "../shared/CrowdingDot"
import { Pill } from "../shared/Pill"

interface CompetitivePipelineProps {
  data: DashboardPublic
}

export function CompetitivePipeline({ data }: CompetitivePipelineProps) {
  const [expandedTarget, setExpandedTarget] = useState<string | null>(null)
  const aiAssessment = data.ai_assessments.find((a) => a.layer === 2)

  return (
    <div className="space-y-3">
      {/* Mechanism Map */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Mechanism Map
        </div>
        <div className="mb-3.5 text-xs leading-normal text-muted-foreground">
          All targets under investigation in {data.indication.name}. Bubble size
          = number of compounds. Tap a target below to see compounds.
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {data.targets.map((t) => {
            const size = 38 + (t.compound_count ?? 0) * 12
            const isExpanded = expandedTarget === t.id
            const bgClass =
              t.crowding === "high"
                ? "bg-red-500/7 border-red-500/12"
                : t.crowding === "medium"
                  ? "bg-yellow-500/8 border-yellow-500/20"
                  : "bg-blue-600/8 border-blue-600/18"
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setExpandedTarget(isExpanded ? null : t.id)}
                className={`flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border transition-transform ${bgClass} ${isExpanded ? "scale-110 ring-2 ring-blue-600/20" : ""}`}
                style={{ width: size, height: size }}
              >
                <div className="text-center font-mono text-[8px] font-bold leading-tight">
                  {t.name}
                </div>
                <div className="mt-px text-[8px] text-muted-foreground/60">
                  {t.compound_count}
                </div>
              </button>
            )
          })}
        </div>
        <div className="flex gap-3.5">
          {(
            [
              { label: "High", level: "high" },
              { label: "Medium", level: "medium" },
              { label: "Low", level: "low" },
            ] as const
          ).map((l) => (
            <div key={l.level} className="flex items-center gap-1.5">
              <CrowdingDot level={l.level} />
              <span className="text-[9px] text-muted-foreground/60">
                {l.label} competition
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Target cards with expandable compounds */}
      {data.targets.map((t) => {
        const isOpen = expandedTarget === t.id
        const compounds = t.compounds ?? []
        return (
          <div
            key={t.id}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            {/* Target header — tap to expand */}
            <button
              type="button"
              onClick={() => setExpandedTarget(isOpen ? null : t.id)}
              className="flex w-full cursor-pointer items-center gap-2.5 p-3.5"
            >
              <CrowdingDot level={t.crowding} />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{t.name}</span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {t.target_class}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2.5">
                  <span className="text-[11px] text-muted-foreground">
                    {compounds.length} compound
                    {compounds.length !== 1 ? "s" : ""}
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
                    {t.crowding}
                  </span>
                </div>
              </div>
              <Pill variant={t.has_marketed_drug ? "green" : "blue"}>
                {t.most_advanced_phase}
              </Pill>
              <ChevronRightIcon
                className={`h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
            </button>

            {/* Expanded compound list */}
            {isOpen && compounds.length > 0 && (
              <div className="border-t bg-muted/30">
                {compounds.map((c, j) => (
                  <div
                    key={c.id}
                    className={`px-3.5 py-3 ${j < compounds.length - 1 ? "border-b" : ""}`}
                  >
                    <div className="mb-1.5 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold">
                          {c.brand_name}
                        </div>
                        <div className="text-[10px] text-muted-foreground/60">
                          {c.inn} &middot; {c.sponsor}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Pill
                          variant={
                            c.phase === "Marketed"
                              ? "green"
                              : c.phase === "Filed"
                                ? "pink"
                                : "blue"
                          }
                        >
                          {c.phase}
                        </Pill>
                        {c.regulatory_designations &&
                          c.regulatory_designations !== "—" && (
                            <Pill variant="yellow">
                              {c.regulatory_designations}
                            </Pill>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div>
                        <span className="text-muted-foreground/60">Route</span>
                        <div className="mt-0.5 font-medium text-muted-foreground">
                          {c.route ?? "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground/60">Onset</span>
                        <div className="mt-0.5 font-medium text-muted-foreground">
                          {c.onset_of_action ?? "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground/60">
                          {c.primary_efficacy_measure ?? "Efficacy"}
                        </span>
                        <div className="mt-0.5 font-mono font-semibold text-green-600">
                          {c.primary_efficacy_value ?? "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground/60">Safety</span>
                        <div
                          className={`mt-0.5 font-medium ${c.has_black_box_warning ? "text-red-600" : "text-muted-foreground"}`}
                        >
                          {c.safety_profile
                            ? c.safety_profile.length > 40
                              ? `${c.safety_profile.slice(0, 40)}...`
                              : c.safety_profile
                            : "—"}
                        </div>
                      </div>
                    </div>

                    {c.has_black_box_warning && c.safety_profile && (
                      <div className="mt-2 rounded-lg border border-red-500/12 bg-red-500/6 px-2.5 py-1.5 text-[10px] text-red-600">
                        &#9888; {c.safety_profile}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

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
