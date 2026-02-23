import type { DashboardPublic } from "@/client"
import { PatientFunnel } from "../charts/PatientFunnel"
import { PipelineDensity } from "../charts/PipelineDensity"
import { Sparkline } from "../charts/Sparkline"
import { AiAssessmentBox } from "../shared/AiAssessmentBox"
import { Pill } from "../shared/Pill"

interface MarketOverviewProps {
  data: DashboardPublic
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const ind = data.indication
  const pop = data.patient_populations[0]
  const aiAssessment = data.ai_assessments.find((a) => a.layer === 1)

  return (
    <div className="space-y-3">
      {/* Market Size & Growth */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Market Size & Growth
        </div>
        <div className="mb-3.5 flex items-end justify-between">
          <div>
            <div className="font-mono text-4xl font-bold tracking-tight">
              ${ind.market_size_usd_bn}B
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground/60">
              {ind.market_year ?? 2024} Global Market
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-bold text-green-600">
              +{ind.market_growth_pct}%
            </div>
            <div className="text-[10px] text-muted-foreground/60">
              YoY Growth
            </div>
          </div>
        </div>
        <Sparkline
          data={ind.market_history ?? []}
          color="#2563eb"
          height={48}
        />
        <div className="mt-1.5 flex justify-between px-0.5">
          {(ind.market_years ?? [])
            .filter((_, i) => i % 2 === 0)
            .map((y) => (
              <span
                key={y}
                className="font-mono text-[9px] text-muted-foreground/40"
              >
                {y}
              </span>
            ))}
        </div>
        <div className="mt-4 flex gap-4 border-t pt-3">
          <div>
            <div className="text-[9px] text-muted-foreground/60">
              Projected {ind.projected_year}
            </div>
            <div className="font-mono text-base font-bold">
              ${ind.projected_size_usd_bn}B
            </div>
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground/60">
              CAGR &apos;24-&apos;30
            </div>
            <div className="font-mono text-base font-bold text-green-600">
              {ind.cagr_pct}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Population Funnel */}
      {pop && (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Patient Population Funnel
          </div>
          <PatientFunnel
            total={pop.total_prevalence}
            stages={[
              {
                label: "Total Prevalence",
                value: pop.total_prevalence,
                color: "#56B4E9",
                unit: "M",
              },
              {
                label: "Diagnosed",
                value: pop.diagnosed,
                color: "#E69F00",
                unit: "M",
              },
              {
                label: "Eligible for Systemic Tx",
                value: pop.treatable,
                color: "#009E73",
                unit: "M",
              },
              {
                label: "Currently Treated",
                value: pop.treated,
                color: "#CC79A7",
                unit: "M",
              },
            ]}
          />
          <div className="mt-2 text-[11px] font-medium text-green-600">
            &rarr; {(pop.treatable - pop.treated).toFixed(0)}M
            treatment-eligible patients not on systemic therapy
          </div>
        </div>
      )}

      {/* Standard of Care & Limitations */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Standard of Care & Limitations
        </div>
        {data.standards_of_care.map((s, i) => (
          <div
            key={s.id}
            className={`flex gap-2.5 py-2.5 ${i < data.standards_of_care.length - 1 ? "border-b" : ""}`}
          >
            <Pill variant="yellow">{s.line_of_therapy}</Pill>
            <div className="flex-1">
              <div className="text-[13px] font-medium">{s.name}</div>
              <div className="mt-0.5 text-[11px] text-red-600">
                &#9888; {s.limitation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Unmet Needs */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Key Unmet Needs
        </div>
        {data.unmet_needs.map((n, i) => (
          <div
            key={n.id}
            className={`flex items-start gap-2.5 ${i < data.unmet_needs.length - 1 ? "mb-2.5" : ""}`}
          >
            <span className="shrink-0 text-sm leading-snug text-green-600">
              &#9671;
            </span>
            <span className="text-[13px] leading-normal text-muted-foreground">
              {n.description}
            </span>
          </div>
        ))}
      </div>

      {/* Pipeline Density */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Pipeline Density
        </div>
        <div className="mb-3 flex items-end justify-between">
          <span className="font-mono text-3xl font-bold">
            {ind.pipeline_total}
          </span>
          <span className="text-[11px] text-muted-foreground/60">
            active programs
          </span>
        </div>
        <PipelineDensity
          phases={[
            { label: "Ph1", value: ind.pipeline_phase1 ?? 0, color: "#56B4E9" },
            { label: "Ph2", value: ind.pipeline_phase2 ?? 0, color: "#E69F00" },
            { label: "Ph3", value: ind.pipeline_phase3 ?? 0, color: "#009E73" },
            {
              label: "Filed",
              value: ind.pipeline_filed ?? 0,
              color: "#CC79A7",
            },
            {
              label: "Mktd",
              value: ind.pipeline_marketed ?? 0,
              color: "#0072B2",
            },
          ]}
        />
      </div>

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
