import type { DashboardPublic } from "@/client"

import { AiAssessmentBox } from "../shared/AiAssessmentBox"
import { Pill } from "../shared/Pill"

interface InvestmentThesisProps {
  data: DashboardPublic
}

export function InvestmentThesis({ data }: InvestmentThesisProps) {
  const aiAssessment = data.ai_assessments.find((a) => a.layer === 7)
  const ind = data.indication
  const pop = data.patient_populations[0]

  // Calculate platform value from expansion indications
  const platformValue = data.expansion_indications.reduce(
    (sum, e) => sum + (e.market_size_usd_bn ?? 0),
    0,
  )

  return (
    <div className="space-y-3">
      {/* Opportunity Summary */}
      <div className="rounded-xl border border-blue-600/18 bg-gradient-to-br from-blue-600/4 to-green-600/3 p-5 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Opportunity Summary
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1 text-[9px] text-muted-foreground/60">
              Addressable Market
            </div>
            <div className="font-mono text-lg font-bold">
              ${ind.market_size_usd_bn}B
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground/60">
              growing {ind.market_growth_pct}% YoY
            </div>
          </div>
          {pop && (
            <div>
              <div className="mb-1 text-[9px] text-muted-foreground/60">
                Untreated Eligible
              </div>
              <div className="font-mono text-lg font-bold">
                {(pop.treatable - pop.treated).toFixed(0)}M
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground/60">
                patients in {pop.unit}
              </div>
            </div>
          )}
          <div>
            <div className="mb-1 text-[9px] text-muted-foreground/60">
              Pipeline Density
            </div>
            <div className="font-mono text-lg font-bold">
              {ind.pipeline_total}
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground/60">
              active programs
            </div>
          </div>
          <div>
            <div className="mb-1 text-[9px] text-muted-foreground/60">
              Platform Value
            </div>
            <div className="font-mono text-lg font-bold">
              ${(platformValue + (ind.market_size_usd_bn ?? 0)).toFixed(1)}B
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground/60">
              across {data.expansion_indications.length + 1} indications
            </div>
          </div>
        </div>
      </div>

      {/* Key Risks */}
      {data.thesis_risks.length > 0 && (
        <div className="rounded-xl border border-red-500/12 bg-red-500/6 p-4 shadow-sm">
          <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-red-600">
            Key Risks
          </div>
          {data.thesis_risks.map((r) => (
            <div key={r.id} className="mb-3 flex items-start gap-2.5">
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  r.severity === "high" ? "bg-red-500" : "bg-yellow-500"
                }`}
              />
              <div>
                <div className="mb-0.5 text-[13px] font-semibold">{r.risk}</div>
                <div className="text-[11px] leading-normal text-muted-foreground">
                  {r.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Go/No-Go Framework */}
      {data.go_nogo_criteria.length > 0 && (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Go / No-Go Framework
          </div>
          <div className="mb-3 text-[11px] leading-normal text-muted-foreground">
            For this investment to succeed, the following would need to be true:
          </div>
          {data.go_nogo_criteria.map((c) => (
            <div key={c.id} className="mb-2.5 flex items-start gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border bg-muted/40 text-[10px] text-muted-foreground/60">
                {c.is_met === true
                  ? "\u2713"
                  : c.is_met === false
                    ? "\u2717"
                    : "?"}
              </div>
              <span className="text-xs leading-normal text-muted-foreground">
                {c.description}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Comparable Transactions */}
      {data.comparable_transactions.length > 0 && (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Comparable Transactions
          </div>
          {data.comparable_transactions.map((dl, i) => (
            <div
              key={dl.id}
              className={`py-2.5 ${i < data.comparable_transactions.length - 1 ? "border-b" : ""}`}
            >
              <div className="mb-1 flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-medium">{dl.asset}</div>
                  <div className="text-[10px] text-muted-foreground/60">
                    {dl.parties}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Pill variant="purple">{dl.transaction_type}</Pill>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {dl.date}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-[10px]">
                <div>
                  <span className="text-muted-foreground/60">Total Value</span>
                  <span className="ml-1 font-mono font-semibold text-muted-foreground">
                    {dl.total_value ?? "—"}
                  </span>
                </div>
                {dl.upfront_value && dl.upfront_value !== "—" && (
                  <div>
                    <span className="text-muted-foreground/60">Upfront</span>
                    <span className="ml-1 font-mono font-semibold text-green-600">
                      {dl.upfront_value}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
