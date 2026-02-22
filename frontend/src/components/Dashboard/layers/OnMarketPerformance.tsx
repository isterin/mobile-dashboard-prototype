import type { DashboardPublic } from "@/client"

import { Sparkline } from "../charts/Sparkline"
import { AiAssessmentBox } from "../shared/AiAssessmentBox"

interface OnMarketPerformanceProps {
  data: DashboardPublic
}

const chartColors = ["#2563eb", "#6366f1", "#7c3aed", "#db2777", "#ca8a04"]

export function OnMarketPerformance({ data }: OnMarketPerformanceProps) {
  const aiAssessment = data.ai_assessments.find((a) => a.layer === 5)
  const drugs = data.marketed_drugs

  return (
    <div className="space-y-3">
      {/* Market Share Bar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Market Share &mdash; {data.indication.market_year ?? 2024}
        </div>
        <div className="mb-2.5 flex h-2.5 gap-0.5 overflow-hidden rounded-md">
          {drugs.map((d, i) => (
            <div
              key={d.id}
              className="rounded-md transition-[width] duration-600"
              style={{
                width: `${d.market_share_pct ?? 0}%`,
                backgroundColor: chartColors[i % chartColors.length],
              }}
            />
          ))}
          <div className="flex-1 rounded-md bg-muted/50" />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {drugs.map((d, i) => (
            <div key={d.id} className="flex items-center gap-1.5">
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{
                  backgroundColor: chartColors[i % chartColors.length],
                }}
              />
              <span className="text-[10px] text-muted-foreground">
                {d.compound_brand_name}
              </span>
              <span
                className={`font-mono text-[10px] font-semibold ${
                  (d.share_change_pct ?? 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(d.share_change_pct ?? 0) > 0 ? "+" : ""}
                {d.share_change_pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Drug Performance Cards */}
      {drugs.map((d, i) => {
        const revenueData = d.revenue_history_m ?? []
        const latestRevenue = revenueData[revenueData.length - 1] ?? 0

        return (
          <div key={d.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-2.5 flex items-start justify-between">
              <div>
                <div className="text-[15px] font-semibold">
                  {d.compound_brand_name}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="font-mono text-[22px] font-bold">
                    ${(latestRevenue / 1000).toFixed(1)}B
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      (d.share_change_pct ?? 0) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(d.share_change_pct ?? 0) > 0 ? "\u2191" : "\u2193"}{" "}
                    {Math.abs(d.share_change_pct ?? 0)}% share
                  </span>
                </div>
              </div>
              <Sparkline
                data={revenueData}
                color={chartColors[i % chartColors.length]}
                width={80}
                height={36}
              />
            </div>

            <div className="mb-2 grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <span className="text-muted-foreground/60">WAC Price</span>
                <div className="mt-0.5 font-mono font-semibold text-muted-foreground">
                  ${((d.wac_price_usd ?? 0) / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <span className="text-muted-foreground/60">
                  Formulary Access
                </span>
                <div
                  className={`mt-0.5 font-mono font-semibold ${
                    Number.parseInt(d.formulary_access_pct ?? "0", 10) >= 80
                      ? "text-green-600"
                      : Number.parseInt(d.formulary_access_pct ?? "0", 10) >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {d.formulary_access_pct ?? "—"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground/60">NBRx/mo</span>
                <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                  <span className="font-medium">{d.nbrx_volume ?? "—"}</span>
                  <span
                    className={`text-xs ${
                      d.nbrx_trend === "up"
                        ? "text-green-600"
                        : d.nbrx_trend === "down"
                          ? "text-red-600"
                          : "text-muted-foreground/60"
                    }`}
                  >
                    {d.nbrx_trend === "up"
                      ? "\u2191"
                      : d.nbrx_trend === "down"
                        ? "\u2193"
                        : "\u2192"}
                  </span>
                </div>
              </div>
            </div>

            {d.compound_has_black_box_warning && (
              <div className="rounded-lg border border-red-500/12 bg-red-500/6 px-2.5 py-1.5 text-[10px] text-red-600">
                &#9888; Black Box Warning &mdash; restricts formulary
                positioning & 1L adoption
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
