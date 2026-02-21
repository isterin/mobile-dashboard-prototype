import { CopilotKit } from "@copilotkit/react-core"
import "@copilotkit/react-ui/styles.css"
import { createFileRoute } from "@tanstack/react-router"
import { Component, type ReactNode, useState } from "react"

import { CopilotChatSidebar } from "@/components/Chat"
import { Button } from "@/components/ui/button"
import { DotIcon } from "@/components/ui/icons/DotIcon"

export const Route = createFileRoute("/_layout/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      {
        title: "Study Status - Medidata",
      },
    ],
  }),
})

// =============================================================================
// Error Boundary for CopilotKit
// =============================================================================
// Catches errors when the CopilotKit runtime is unavailable

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
  const [isChatCollapsed, setIsChatCollapsed] = useState(true)

  // Example context data to share with the AI
  // Replace this with your actual application state
  const contextData = {
    page: "dashboard",
    // Add your application data here that you want the AI to be aware of
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Main Content Area */}
      <div className="flex-1 space-y-4 overflow-auto p-1">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Study Status</h1>
            <p className="text-muted-foreground">
              Welcome to the Study Status application.
            </p>
          </div>

          {/* Dot AI help button - visible when chat is collapsed */}
          {isChatCollapsed && (
            <Button
              onClick={() => setIsChatCollapsed(false)}
              className="dot-ai-button dot-ai-button-pulse flex items-center gap-2"
              size="sm"
            >
              <DotIcon className="h-4 w-4" />
              Ask Dot
            </Button>
          )}
        </div>

        {/* Dashboard Content Placeholder */}
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Dashboard Content
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your dashboard components here.
          </p>
        </div>
      </div>

      {/* CopilotKit Chat Sidebar */}
      <CopilotErrorBoundary
        fallback={
          <CopilotChatSidebar
            isCollapsed={isChatCollapsed}
            onToggleCollapse={() => setIsChatCollapsed((prev) => !prev)}
            isUnavailable={true}
          />
        }
      >
        <CopilotKit
          runtimeUrl={import.meta.env.VITE_COPILOT_RUNTIME_URL}
          agent="study_status_assistant"
          showDevConsole={import.meta.env.VITE_SHOW_DEVTOOLS === "true"}
          enableInspector={import.meta.env.VITE_SHOW_DEVTOOLS === "true"}
        >
          <CopilotChatSidebar
            contextData={contextData}
            isCollapsed={isChatCollapsed}
            onToggleCollapse={() => setIsChatCollapsed((prev) => !prev)}
          />
        </CopilotKit>
      </CopilotErrorBoundary>
    </div>
  )
}
