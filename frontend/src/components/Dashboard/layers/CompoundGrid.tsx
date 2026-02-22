import { useState } from "react"

import type { DashboardPublic } from "@/client"

import { Pill } from "../shared/Pill"

interface CompoundGridProps {
  data: DashboardPublic
}

const phaseRank: Record<string, number> = {
  Marketed: 0,
  Filed: 1,
  "Phase 3": 2,
  "Phase 2": 3,
  "Phase 1": 4,
}

export function CompoundGrid({ data }: CompoundGridProps) {
  const [filterMoa, setFilterMoa] = useState("All")

  const moas = ["All", ...new Set(data.compounds.map((c) => c.moa))]

  let items = [...data.compounds]
  if (filterMoa !== "All") items = items.filter((c) => c.moa === filterMoa)
  items.sort((a, b) => (phaseRank[a.phase] ?? 9) - (phaseRank[b.phase] ?? 9))

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {moas.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setFilterMoa(m)}
            className={`rounded-md border px-2.5 py-1 text-[10px] font-medium transition-colors ${
              filterMoa === m
                ? "border-blue-600/18 bg-blue-600/8 text-blue-600"
                : "border-border bg-card text-muted-foreground/60 shadow-sm hover:text-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Compound Cards */}
      {items.map((c) => (
        <div key={c.id} className="rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <div className="text-[15px] font-semibold">{c.brand_name}</div>
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
                  <Pill variant="yellow">{c.regulatory_designations}</Pill>
                )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-muted-foreground/60">MOA</span>
              <div className="mt-0.5 font-medium text-muted-foreground">
                {c.moa}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground/60">Route</span>
              <div className="mt-0.5 font-medium text-muted-foreground">
                {c.route ?? "—"}
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
              <span className="text-muted-foreground/60">Onset</span>
              <div className="mt-0.5 font-medium text-muted-foreground">
                {c.onset_of_action ?? "—"}
              </div>
            </div>
          </div>

          {c.has_black_box_warning ? (
            <div className="mt-2.5 rounded-lg border border-red-500/12 bg-red-500/6 px-2.5 py-1.5 text-[11px] text-red-600">
              &#9888; {c.safety_profile}
            </div>
          ) : (
            c.safety_profile && (
              <div className="mt-2.5 text-[11px] text-muted-foreground/60">
                Safety: {c.safety_profile}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  )
}
