"""AG-UI endpoint for the market analysis assistant agent.

This module exposes the ADK agent via the AG-UI protocol for CopilotKit integration.
"""

from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from fastapi import APIRouter

from app.agent.assistant_agent import create_assistant_agent

router = APIRouter(tags=["agent"])

# Create the ADK agent and wrap it for AG-UI protocol
_adk_agent = create_assistant_agent()
_agent_wrapper = ADKAgent(
    adk_agent=_adk_agent,
    app_name="market_analysis",
    user_id="default",
    use_in_memory_services=True,
)

# Add the AG-UI endpoint at the router's root path
# The router will be mounted at /agent, so this creates POST /agent
add_adk_fastapi_endpoint(router, _agent_wrapper, path="")
