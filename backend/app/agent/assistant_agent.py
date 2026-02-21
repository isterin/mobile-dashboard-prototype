"""Study status assistant agent using Google ADK with AWS Bedrock.

This module provides a generic AI assistant that can be customized for the
study status application. It demonstrates the pattern for:
- Dynamic instruction injection from AG-UI context
- Integration with AWS Bedrock via LiteLLM
- Reading frontend state via useCopilotReadable
"""

from google.adk.agents import LlmAgent
from google.adk.agents.readonly_context import ReadonlyContext
from google.adk.models.lite_llm import LiteLlm

# AG-UI context state key (from ag-ui-adk)
# This is where ag-ui-adk stores context passed from useCopilotReadable
CONTEXT_STATE_KEY = "_ag_ui_context"

# AWS Bedrock model via LiteLLM
# Requires AWS credentials (env vars, ~/.aws/credentials, or IAM role)
BEDROCK_MODEL = "us.anthropic.claude-sonnet-4-20250514-v1:0"

BASE_INSTRUCTION = """You are a helpful assistant for the Study Status application.

Your role is to help users understand and interact with the application data and features.

## How to Help Users

1. **Answer questions**: Provide clear, concise answers about the data displayed in the application
2. **Explain concepts**: Help users understand any complex information or metrics
3. **Guide navigation**: Help users find what they're looking for
4. **Perform actions**: When asked, use available tools to interact with the application

## Guidelines

- Be concise but informative
- Use specific data from the context when available
- If you don't have enough context to answer a question, ask for clarification
- Acknowledge uncertainty when data may be incomplete
"""


def instruction_provider(ctx: ReadonlyContext) -> str:
    """Dynamic instruction provider that injects AG-UI context.

    This function is called by the ADK agent before each turn to build
    the system instruction. It reads context from the AG-UI protocol
    (passed via useCopilotReadable from the frontend) and injects it
    into the prompt.

    Args:
        ctx: The readonly context containing state from the AG-UI session.

    Returns:
        The complete instruction string with dynamic context injected.
    """
    # Get AG-UI context from state (set by ag-ui-adk from RunAgentInput.context)
    ag_ui_context = ctx.state.get(CONTEXT_STATE_KEY, [])

    if not ag_ui_context:
        return BASE_INSTRUCTION

    # Format context items as structured sections
    context_sections = []
    for item in ag_ui_context:
        description = item.get("description", "Unknown")
        value = item.get("value", "")
        # Format each context item with its description as a header
        context_sections.append(f"### {description}\n```json\n{value}\n```")

    context_text = "\n\n".join(context_sections)

    return f"""{BASE_INSTRUCTION}

## Current Application Context

The following data is currently available from the user's session. Use this to provide
specific, data-driven answers:

{context_text}
"""


def create_assistant_agent() -> LlmAgent:
    """Create the study status assistant agent.

    The agent uses a dynamic instruction provider to inject context from
    the frontend (via useCopilotReadable hooks) into the system prompt.
    This allows the agent to see the current application state.

    Returns:
        LlmAgent: The configured ADK agent for the study status application.
    """
    return LlmAgent(
        name="study_status_assistant",
        model=LiteLlm(model=BEDROCK_MODEL),
        instruction=instruction_provider,
    )
