import { CopilotKit } from "@copilotkit/react-core"
import "@copilotkit/react-ui/styles.css"
import { createFileRoute } from "@tanstack/react-router"
import { Component, type ReactNode, useState } from "react"

import { CopilotChatSidebar } from "@/components/Chat"
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

  // Context data to share with the AI assistant
  const contextData = {
    page: "dashboard",
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
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h2 className="text-lg font-semibold text-muted-foreground">
              Dashboard Content
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your dashboard components here.
            </p>
          </div>
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
