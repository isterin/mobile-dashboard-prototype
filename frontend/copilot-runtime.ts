/**
 * CopilotKit Runtime Server
 *
 * This small Express server hosts the CopilotRuntime middleware that connects
 * the CopilotKit React components to the AG-UI ADK agent backend.
 *
 * Architecture:
 *   React Frontend (port 5173) → CopilotRuntime (port 4000) → AG-UI Agent (port 8000)
 */

import { HttpAgent } from "@ag-ui/client"
import {
  CopilotRuntime,
  copilotRuntimeNodeExpressEndpoint,
  ExperimentalEmptyAdapter,
} from "@copilotkit/runtime"
import cors from "cors"
import express from "express"

const app = express()

// Enable CORS for the frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)

// The AG-UI agent endpoint URL
const AGENT_URL = process.env.AGENT_URL || "http://localhost:8000/agent"

// Create the CopilotRuntime with our AG-UI agent
const serviceAdapter = new ExperimentalEmptyAdapter()
const runtime = new CopilotRuntime({
  agents: {
    market_analysis_assistant: new HttpAgent({
      url: AGENT_URL,
    }),
  },
})

// Mount the CopilotKit endpoint
// Note: Express strips the mount path before passing to the handler,
// so we use endpoint: "/" since the handler receives paths like "/info" not "/copilotkit/info"
app.use(
  "/copilotkit",
  copilotRuntimeNodeExpressEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/",
  }),
)

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", agentUrl: AGENT_URL })
})

const PORT = process.env.COPILOT_PORT || 4000

app.listen(PORT, () => {
  console.log(`CopilotKit Runtime server listening on http://localhost:${PORT}`)
  console.log(`  - CopilotKit endpoint: http://localhost:${PORT}/copilotkit`)
  console.log(`  - AG-UI Agent URL: ${AGENT_URL}`)
})
