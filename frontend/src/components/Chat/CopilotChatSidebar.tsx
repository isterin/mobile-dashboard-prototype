import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { CopilotChat } from "@copilotkit/react-ui"
import { MessageSquareOffIcon, XIcon } from "lucide-react"

import type { DashboardPublic } from "@/client"
import { Button } from "@/components/ui/button"

interface CopilotChatSidebarProps {
  /** Data to share with the AI assistant via useCopilotReadable */
  contextData?: {
    page: string
    activeTab: string
    selectedIndication: string | null
    dashboardData: DashboardPublic | null
  }
  /** Callback to close the sidebar */
  onClose: () => void
  /** Whether the agent is unavailable (runtime not running) */
  isUnavailable?: boolean
}

/**
 * CopilotKit-powered chat sidebar component.
 *
 * Shares the full dashboard data with the AI assistant via useCopilotReadable,
 * broken into semantic layers so the AI can reference specific aspects of the
 * competitive intelligence dashboard in its responses.
 */
export function CopilotChatSidebar({
  contextData,
  onClose,
  isUnavailable = false,
}: CopilotChatSidebarProps) {
  const dashboard = contextData?.dashboardData ?? null

  // ==========================================================================
  // Share application context with AI via useCopilotReadable
  // ==========================================================================

  useCopilotReadable({
    description:
      "Current navigation state: which page and tab the user is viewing, and which indication is selected",
    value: JSON.stringify({
      page: contextData?.page ?? "dashboard",
      activeTab: contextData?.activeTab ?? null,
      selectedIndication: contextData?.selectedIndication ?? null,
    }),
  })

  useCopilotReadable({
    description:
      "Layer 1 — Indication Market Overview: indication details, market size, growth, pipeline counts, patient populations, standards of care, and unmet needs",
    value: JSON.stringify({
      indication: dashboard?.indication ?? null,
      patient_populations: dashboard?.patient_populations ?? [],
      standards_of_care: dashboard?.standards_of_care ?? [],
      unmet_needs: dashboard?.unmet_needs ?? [],
    }),
  })

  useCopilotReadable({
    description:
      "Layer 2 — Competitive Pipeline: biological targets being pursued with their classes, crowding levels, most advanced phases, and nested compound details (sponsor, phase, efficacy, safety, designations) for each target",
    value: JSON.stringify({
      targets: dashboard?.targets ?? [],
    }),
  })

  useCopilotReadable({
    description:
      "Layer 3 — Competitor Trial Tracker: clinical trials with phase, status, enrollment numbers, start/end dates, and associated compounds",
    value: JSON.stringify({
      trials: dashboard?.trials ?? [],
    }),
  })

  useCopilotReadable({
    description:
      "Layer 4 — In-Market Performance: marketed drugs with revenue history, market share, WAC price, and prescription volume",
    value: JSON.stringify({
      marketed_drugs: dashboard?.marketed_drugs ?? [],
    }),
  })

  useCopilotReadable({
    description:
      "Layer 5 — Expansion Opportunity: potential expansion indications with market size, competitive density, and validation status",
    value: JSON.stringify({
      expansion_indications: dashboard?.expansion_indications ?? [],
    }),
  })

  useCopilotReadable({
    description:
      "Layer 6 — Investment Thesis: comparable transactions, thesis risks with severity, and go/no-go criteria with met/unmet status",
    value: JSON.stringify({
      comparable_transactions: dashboard?.comparable_transactions ?? [],
      thesis_risks: dashboard?.thesis_risks ?? [],
      go_nogo_criteria: dashboard?.go_nogo_criteria ?? [],
    }),
  })

  useCopilotReadable({
    description:
      "Cross-layer AI Assessments: AI-generated insights for each dashboard layer including title and detailed content",
    value: JSON.stringify({
      ai_assessments: dashboard?.ai_assessments ?? [],
    }),
  })

  // ==========================================================================
  // Enable AI actions via useCopilotAction
  // ==========================================================================

  useCopilotAction({
    name: "getHelp",
    description:
      "Provide help information about the application. Use this when the user asks for help or how to use the application.",
    parameters: [],
    handler: async () => {
      return "This is the Market Analysis Dashboard. You can ask me questions about the data displayed, and I'll help you understand it."
    },
  })

  // Unavailable state (agent not running)
  if (isUnavailable) {
    return (
      <div className="relative flex h-full w-full flex-col border-l bg-card md:w-96">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-40 h-7 w-7"
          onClick={onClose}
        >
          <XIcon className="h-4 w-4" />
        </Button>

        <div className="border-b p-4">
          <h2 className="flex items-center gap-2 font-semibold text-muted-foreground">
            <MessageSquareOffIcon className="h-5 w-5" />
            Chat Unavailable
          </h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <p className="text-sm text-muted-foreground">
            The AI assistant is not available.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Start the CopilotKit runtime server with{" "}
            <code className="rounded bg-muted px-1">bun run copilot</code> to
            enable chat.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col border-l bg-card md:w-96">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-40 h-7 w-7"
        onClick={onClose}
      >
        <XIcon className="h-4 w-4" />
      </Button>

      {/* CopilotChat fills the container */}
      <div className="copilot-chat-embedded">
        <CopilotChat
          labels={{
            title: "Dot",
            initial:
              "Hi! I'm Dot, your AI assistant. How can I help you today?",
          }}
        />
      </div>
    </div>
  )
}
