import type { DashboardPublic } from "@/client"

import { AiAssessmentBox } from "../shared/AiAssessmentBox"
import { CrowdingDot } from "../shared/CrowdingDot"
import { Pill } from "../shared/Pill"

interface ExpansionOpportunityProps {
  data: DashboardPublic
}

export function ExpansionOpportunity({ data }: ExpansionOpportunityProps) {
  const aiAssessment = data.ai_assessments.find((a) => a.layer === 5)
  const expansions = data.expansion_indications

  // Calculate total platform value
  const totalPlatformValue = expansions.reduce(
    (sum, e) => sum + (e.market_size_usd_bn ?? 0),
    0,
  )

  return (
    <div className="space-y-3">
      {/* Platform Value Summary */}
      <div className="rounded-xl border border-blue-600/18 bg-gradient-to-br from-blue-600/4 to-green-600/3 p-5 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Platform Value Overview
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] text-muted-foreground/60">
              Expansion Indications
            </div>
            <div className="font-mono text-2xl font-bold">
              {expansions.length}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground/60">
              Total Addressable Market
            </div>
            <div className="font-mono text-2xl font-bold">
              ${totalPlatformValue.toFixed(1)}B
            </div>
          </div>
        </div>
      </div>

      {/* Expansion Indication Cards */}
      {expansions.map((e) => (
        <div key={e.id} className="rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              {e.competitive_density && (
                <CrowdingDot level={e.competitive_density} />
              )}
              <div className="text-sm font-semibold">{e.name}</div>
            </div>
            {e.validation_status && (
              <Pill
                variant={
                  e.validation_status === "Marketed"
                    ? "green"
                    : e.validation_status.includes("Phase 3")
                      ? "purple"
                      : "blue"
                }
              >
                {e.validation_status}
              </Pill>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {e.market_size_usd_bn != null && (
              <div>
                <span className="text-muted-foreground/60">Market Size</span>
                <div className="mt-0.5 font-mono font-semibold">
                  ${e.market_size_usd_bn}B
                </div>
              </div>
            )}
            {e.patient_population && (
              <div>
                <span className="text-muted-foreground/60">
                  Patient Population
                </span>
                <div className="mt-0.5 font-medium text-muted-foreground">
                  {e.patient_population}
                </div>
              </div>
            )}
            {e.competitive_density && (
              <div>
                <span className="text-muted-foreground/60">Competition</span>
                <div
                  className={`mt-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                    e.competitive_density === "high"
                      ? "text-red-500"
                      : e.competitive_density === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {e.competitive_density}
                </div>
              </div>
            )}
            {e.scientific_rationale && (
              <div>
                <span className="text-muted-foreground/60">
                  Scientific Rationale
                </span>
                <div
                  className={`mt-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                    e.scientific_rationale === "strong"
                      ? "text-green-600"
                      : e.scientific_rationale === "moderate"
                        ? "text-yellow-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {e.scientific_rationale}
                </div>
              </div>
            )}
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
