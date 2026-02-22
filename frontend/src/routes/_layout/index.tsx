import { CopilotKit } from "@copilotkit/react-core"
import "@copilotkit/react-ui/styles.css"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Component, type ReactNode, useState } from "react"

import { IndicationsService } from "@/client"
import { CopilotChatSidebar } from "@/components/Chat"
import { IndicationDashboard } from "@/components/Dashboard"
import { MedidataHeader } from "@/components/MedidataHeader"

export const Route = createFileRoute("/_layout/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      {
        title: "Market Analysis Dashboard",
      },
    ],
  }),
})

// =============================================================================
// Error Boundary for CopilotKit
// =============================================================================

interface ErrorBoundaryState {
  hasError: boolean
}

class CopilotErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// =============================================================================
// Main Dashboard Page
// =============================================================================

function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
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

  // Context data to share with the AI assistant
  const contextData = {
    page: "dashboard",
    activeTab,
    selectedIndication: dashboardData?.indication?.name ?? null,
    dashboardData: dashboardData ?? null,
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Medidata global header */}
      <MedidataHeader
        onToggleChat={() => setIsChatOpen(true)}
        isChatVisible={isChatOpen}
      />

      {/* Main content area below header */}
      <div className="flex min-h-0 flex-1">
        {/* Dashboard content */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <IndicationDashboard
            indications={indications}
            selectedIndicationId={selectedIndicationId}
            onSelectIndication={setSelectedIndicationId}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            dashboardData={dashboardData}
            isLoadingIndications={indicationsQuery.isLoading}
            isLoadingDashboard={dashboardQuery.isLoading}
            dashboardError={!!dashboardQuery.error}
          />
        </div>

        {/* CopilotKit Chat Sidebar — only rendered when open */}
        {/* On mobile: full-screen overlay. On md+: side-by-side panel. */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 h-dvh md:relative md:inset-auto md:z-auto md:h-auto">
            <CopilotErrorBoundary
              fallback={
                <CopilotChatSidebar
                  onClose={() => setIsChatOpen(false)}
                  isUnavailable={true}
                />
              }
            >
              <CopilotKit
                runtimeUrl={import.meta.env.VITE_COPILOT_RUNTIME_URL}
                agent="market_analysis_assistant"
                showDevConsole={import.meta.env.VITE_SHOW_DEVTOOLS === "true"}
                enableInspector={import.meta.env.VITE_SHOW_DEVTOOLS === "true"}
              >
                <CopilotChatSidebar
                  contextData={contextData}
                  onClose={() => setIsChatOpen(false)}
                />
              </CopilotKit>
            </CopilotErrorBoundary>
          </div>
        )}
      </div>
    </div>
  )
}
