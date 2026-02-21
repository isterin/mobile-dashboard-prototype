import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { CopilotChat } from "@copilotkit/react-ui"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  MessageSquareOffIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopilotChatSidebarProps {
  /** Data to share with the AI assistant via useCopilotReadable */
  contextData?: Record<string, unknown>
  /** Whether the sidebar is collapsed */
  isCollapsed: boolean
  /** Callback when collapse state changes */
  onToggleCollapse: () => void
  /** Whether the agent is unavailable (runtime not running) */
  isUnavailable?: boolean
}

/**
 * CopilotKit-powered chat sidebar component.
 *
 * This component demonstrates the pattern for integrating CopilotKit:
 * - useCopilotReadable: Share application state with the AI
 * - useCopilotAction: Enable AI to perform actions in the app
 *
 * Customize the useCopilotReadable hooks to share your application's data,
 * and add useCopilotAction hooks to enable AI-driven interactions.
 */
export function CopilotChatSidebar({
  contextData,
  isCollapsed,
  onToggleCollapse,
  isUnavailable = false,
}: CopilotChatSidebarProps) {
  // ==========================================================================
  // Share application context with AI via useCopilotReadable
  // ==========================================================================
  // Add your own useCopilotReadable hooks here to share relevant data.
  // The AI will see this in its context and can reference it in responses.
  //
  // Example:
  // useCopilotReadable({
  //   description: "Currently selected dashboard filters",
  //   value: JSON.stringify(filters),
  // })

  useCopilotReadable({
    description: "Application context data",
    value: JSON.stringify(contextData ?? {}),
  })

  // ==========================================================================
  // Enable AI actions via useCopilotAction
  // ==========================================================================
  // Add your own useCopilotAction hooks here to let the AI perform actions.
  //
  // Example:
  // useCopilotAction({
  //   name: "applyFilter",
  //   description: "Apply a filter to the dashboard",
  //   parameters: [
  //     { name: "filterType", type: "string", required: true },
  //     { name: "value", type: "string", required: true },
  //   ],
  //   handler: async ({ filterType, value }) => {
  //     onApplyFilter(filterType, value)
  //     return `Applied ${filterType} filter: ${value}`
  //   },
  // })

  useCopilotAction({
    name: "getHelp",
    description:
      "Provide help information about the application. Use this when the user asks for help or how to use the application.",
    parameters: [],
    handler: async () => {
      return "This is the Study Status application. You can ask me questions about the data displayed, and I'll help you understand it."
    },
  })

  // Unavailable state (agent not running)
  if (isUnavailable) {
    return (
      <div
        className={cn(
          "relative flex flex-col border-l bg-card transition-all duration-300",
          isCollapsed ? "w-12" : "w-96",
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-3 top-4 z-40 h-6 w-6 rounded-full border bg-background shadow-sm"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <ChevronLeftIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>

        {isCollapsed ? (
          <div className="flex h-full flex-col items-center py-4">
            <MessageSquareOffIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        ) : (
          <>
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
                <code className="rounded bg-muted px-1">bun run copilot</code>{" "}
                to enable chat.
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex flex-col border-l bg-card transition-all duration-300",
        isCollapsed ? "w-12" : "w-96",
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-3 top-4 z-40 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={onToggleCollapse}
      >
        {isCollapsed ? (
          <ChevronLeftIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </Button>

      {isCollapsed ? (
        /* Collapsed State */
        <div className="flex h-full flex-col items-center py-4">
          <MessageSquareIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      ) : (
        /* Expanded State - CopilotChat fills the container */
        <div className="copilot-chat-embedded">
          <CopilotChat
            labels={{
              title: "Dot",
              initial:
                "Hi! I'm Dot, your AI assistant. How can I help you today?",
            }}
          />
        </div>
      )}
    </div>
  )
}
