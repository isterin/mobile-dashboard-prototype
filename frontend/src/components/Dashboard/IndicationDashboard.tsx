import { useEffect, useRef } from "react"
import {
  ArrowUpRightIcon,
  ClipboardListIcon,
  DollarSignIcon,
  FlaskConicalIcon,
  ScaleIcon,
  TrendingUpIcon,
} from "lucide-react"

import type { DashboardPublic, IndicationPublic } from "@/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CompetitivePipeline } from "./layers/CompetitivePipeline"
import { ExpansionOpportunity } from "./layers/ExpansionOpportunity"
import { InMarketPerformance } from "./layers/InMarketPerformance"
import { InvestmentThesis } from "./layers/InvestmentThesis"
import { MarketOverview } from "./layers/MarketOverview"
import { TrialTracker } from "./layers/TrialTracker"

const TABS = [
  { id: "market", label: "Market", Icon: TrendingUpIcon },
  { id: "pipeline", label: "Pipeline", Icon: FlaskConicalIcon },
  { id: "trials", label: "Trials", Icon: ClipboardListIcon },
  { id: "in-market", label: "In Market", Icon: DollarSignIcon },
  { id: "expansion", label: "Expand", Icon: ArrowUpRightIcon },
  { id: "thesis", label: "Thesis", Icon: ScaleIcon },
] as const

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  market: {
    title: "Indication Market Overview",
    subtitle: "Is this indication worth entering?",
  },
  pipeline: {
    title: "Competitive Pipeline",
    subtitle: "What mechanisms & compounds are in play?",
  },
  trials: {
    title: "Competitor Trial Tracker",
    subtitle: "What's coming and when?",
  },
  "in-market": {
    title: "In-Market Performance",
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

interface IndicationDashboardProps {
  indications: IndicationPublic[]
  selectedIndicationId: string | null
  onSelectIndication: (id: string) => void
  activeTab: string
  onChangeTab: (tab: string) => void
  dashboardData: DashboardPublic | undefined
  isLoadingIndications: boolean
  isLoadingDashboard: boolean
  dashboardError: boolean
}

export function IndicationDashboard({
  indications,
  selectedIndicationId,
  onSelectIndication,
  activeTab,
  onChangeTab,
  dashboardData,
  isLoadingIndications,
  isLoadingDashboard,
  dashboardError,
}: IndicationDashboardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Reset scroll position when switching tabs
  useEffect(() => {
    if (activeTab) {
      scrollContainerRef.current?.scrollTo(0, 0)
    }
  }, [activeTab])

  const tabMeta = TAB_TITLES[activeTab]

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-card px-4 py-2 md:px-5 md:py-3">
        <div className="flex items-center justify-between gap-2">
          {tabMeta && (
            <div className="min-w-0 truncate text-sm font-bold tracking-tight">
              {tabMeta.title}
            </div>
          )}
          <select
            value={selectedIndicationId ?? ""}
            onChange={(e) => onSelectIndication(e.target.value)}
            className="shrink-0 rounded-md border bg-card px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {indications.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Error states */}
      {isLoadingIndications && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Loading indications...
          </div>
        </div>
      )}

      {isLoadingDashboard && selectedIndicationId && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Loading dashboard...
          </div>
        </div>
      )}

      {dashboardError && (
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
          onValueChange={onChangeTab}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable content area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto px-4 pb-20 pt-4 md:px-5"
          >
            <TabsContent value="market" className="mt-0">
              <MarketOverview data={dashboardData} />
            </TabsContent>
            <TabsContent value="pipeline" className="mt-0">
              <CompetitivePipeline data={dashboardData} />
            </TabsContent>
            <TabsContent value="trials" className="mt-0">
              <TrialTracker data={dashboardData} />
            </TabsContent>
            <TabsContent value="in-market" className="mt-0">
              <InMarketPerformance data={dashboardData} />
            </TabsContent>
            <TabsContent value="expansion" className="mt-0">
              <ExpansionOpportunity data={dashboardData} />
            </TabsContent>
            <TabsContent value="thesis" className="mt-0">
              <InvestmentThesis data={dashboardData} />
            </TabsContent>
          </div>

          {/* Bottom Tab Navigation */}
          <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background to-transparent pt-2 md:sticky md:bg-none md:pt-0">
            <TabsList className="flex h-auto w-full justify-around rounded-none border-t bg-card/92 px-1 py-1.5 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex min-w-0 flex-col items-center gap-0.5 rounded-none border-0 bg-transparent px-1.5 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <tab.Icon
                    className={`h-4 w-4 transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-muted-foreground/70"
                    }`}
                  />
                  <span
                    className={`font-mono text-[10px] tracking-wide transition-colors ${
                      activeTab === tab.id
                        ? "font-semibold text-blue-600"
                        : "text-muted-foreground/70"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="mt-0.5 h-[2px] w-full rounded-full bg-blue-600" />
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
