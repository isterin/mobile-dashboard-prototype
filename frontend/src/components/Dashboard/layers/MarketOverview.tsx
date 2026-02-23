import type { DashboardPublic } from "@/client"
import { FunnelBar } from "../charts/FunnelBar"
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
          <FunnelBar
            label="Total Prevalence"
            value={pop.total_prevalence}
            total={pop.total_prevalence}
            color="#2563eb"
            unit={`M`}
          />
          <FunnelBar
            label="Diagnosed"
            value={pop.diagnosed}
            total={pop.total_prevalence}
            color="#6366f1"
            unit={`M`}
          />
          <FunnelBar
            label="Eligible for Systemic Tx"
            value={pop.treatable}
            total={pop.total_prevalence}
            color="#7c3aed"
            unit={`M`}
          />
          <FunnelBar
            label="Currently Treated (Systemic)"
            value={pop.treated}
            total={pop.total_prevalence}
            color="#db2777"
            unit={`M`}
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
        <div className="flex h-12 items-end gap-1">
          {[
            { label: "Ph1", val: ind.pipeline_phase1, color: "#2563eb" },
            { label: "Ph2", val: ind.pipeline_phase2, color: "#6366f1" },
            { label: "Ph3", val: ind.pipeline_phase3, color: "#7c3aed" },
            { label: "Filed", val: ind.pipeline_filed, color: "#db2777" },
            { label: "Mktd", val: ind.pipeline_marketed, color: "#16a34a" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span
                className="font-mono text-[10px] font-semibold"
                style={{ color: b.color }}
              >
                {b.val}
              </span>
              <div
                className="w-full min-h-1 rounded transition-[height] duration-600 ease-out"
                style={{
                  height: `${((b.val ?? 0) / 20) * 48}px`,
                  backgroundColor: `${b.color}30`,
                }}
              />
              <span className="font-mono text-[8px] text-muted-foreground/60">
                {b.label}
              </span>
            </div>
          ))}
        </div>
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
