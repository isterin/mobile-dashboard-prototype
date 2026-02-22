import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { IndicationsService } from "@/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CompoundGrid } from "./layers/CompoundGrid"
import { ExpansionOpportunity } from "./layers/ExpansionOpportunity"
import { InvestmentThesis } from "./layers/InvestmentThesis"
import { MarketOverview } from "./layers/MarketOverview"
import { OnMarketPerformance } from "./layers/OnMarketPerformance"
import { TargetLandscape } from "./layers/TargetLandscape"
import { TrialTracker } from "./layers/TrialTracker"

const TABS = [
  { id: "market", label: "Market", icon: "\u25C9" },
  { id: "targets", label: "Targets", icon: "\u25CE" },
  { id: "compounds", label: "Compounds", icon: "\u25C8" },
  { id: "trials", label: "Trials", icon: "\u25C7" },
  { id: "on-market", label: "On Market", icon: "\u25C6" },
  { id: "expansion", label: "Expansion", icon: "\u25CB" },
  { id: "thesis", label: "Thesis", icon: "\u2726" },
] as const

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  market: {
    title: "Indication Market Overview",
    subtitle: "Is this indication worth entering?",
  },
  targets: {
    title: "Target & Mechanism Landscape",
    subtitle: "Where are the scientific openings?",
  },
  compounds: {
    title: "Competitive Compound Grid",
    subtitle: "What exactly am I up against?",
  },
  trials: {
    title: "Competitor Trial Tracker",
    subtitle: "What's coming and when?",
  },
  "on-market": {
    title: "On-Market Performance",
    subtitle: "How entrenched are the incumbents?",
  },
  expansion: {
    title: "Expansion Opportunity",
    subtitle: "What's the platform value beyond primary indication?",
  },
  thesis: {
    title: "Investment Thesis",
    subtitle: "Should we invest?",
  },
}

export function IndicationDashboard() {
  const [selectedIndicationId, setSelectedIndicationId] = useState<
    string | null
  >(null)
  const [activeTab, setActiveTab] = useState("market")

  // Fetch indication list
  const indicationsQuery = useQuery({
    queryKey: ["indications"],
    queryFn: () => IndicationsService.listIndications(),
  })

  // Auto-select first indication when data loads
  const indications = indicationsQuery.data?.data ?? []
  if (indications.length > 0 && !selectedIndicationId) {
    setSelectedIndicationId(indications[0].id)
  }

  // Fetch dashboard data for selected indication
  const dashboardQuery = useQuery({
    queryKey: ["dashboard", selectedIndicationId],
    queryFn: () =>
      IndicationsService.getDashboard({
        indicationId: selectedIndicationId!,
      }),
    enabled: !!selectedIndicationId,
  })

  const dashboardData = dashboardQuery.data
  const tabMeta = TAB_TITLES[activeTab]

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3 md:px-5 md:py-4">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            Competitive Intelligence
          </div>
          {/* Indication Selector */}
          <select
            value={selectedIndicationId ?? ""}
            onChange={(e) => setSelectedIndicationId(e.target.value)}
            className="rounded-md border bg-card px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {indications.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </select>
        </div>
        {tabMeta && (
          <>
            <div className="text-lg font-bold tracking-tight md:text-xl">
              {tabMeta.title}
            </div>
            <div className="text-xs italic text-muted-foreground/60">
              {tabMeta.subtitle}
            </div>
          </>
        )}
      </div>

      {/* Loading / Error states */}
      {indicationsQuery.isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Loading indications...
          </div>
        </div>
      )}

      {dashboardQuery.isLoading && selectedIndicationId && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Loading dashboard...
          </div>
        </div>
      )}

      {dashboardQuery.error && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-red-600">
            Failed to load dashboard data. Please try again.
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {dashboardData && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto px-4 pb-20 pt-4 md:px-5">
            <TabsContent value="market" className="mt-0">
              <MarketOverview data={dashboardData} />
            </TabsContent>
            <TabsContent value="targets" className="mt-0">
              <TargetLandscape data={dashboardData} />
            </TabsContent>
            <TabsContent value="compounds" className="mt-0">
              <CompoundGrid data={dashboardData} />
            </TabsContent>
            <TabsContent value="trials" className="mt-0">
              <TrialTracker data={dashboardData} />
            </TabsContent>
            <TabsContent value="on-market" className="mt-0">
              <OnMarketPerformance data={dashboardData} />
            </TabsContent>
            <TabsContent value="expansion" className="mt-0">
              <ExpansionOpportunity data={dashboardData} />
            </TabsContent>
            <TabsContent value="thesis" className="mt-0">
              <InvestmentThesis data={dashboardData} />
            </TabsContent>
          </div>

          {/* Bottom Tab Navigation */}
          <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background to-transparent pt-5 md:sticky md:bg-none md:pt-0">
            <TabsList className="flex h-auto w-full justify-around rounded-none border-t bg-card/92 px-1 py-2 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex min-w-0 flex-col items-center gap-0.5 rounded-none border-0 bg-transparent px-1.5 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <span
                    className={`text-base leading-none transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`font-mono text-[9px] tracking-wide transition-colors ${
                      activeTab === tab.id
                        ? "font-semibold text-blue-600"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="-mt-px h-[3px] w-[3px] rounded-full bg-blue-600" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      )}
    </div>
  )
}
