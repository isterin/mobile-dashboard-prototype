# AGENTS.md - AI Coding Agent Guidelines

## Quick Reference

### Build & Run Commands
```bash
# Backend
cd backend && fastapi dev app/main.py        # Run dev server (port 8000)
cd backend && uv run pytest                   # Run all tests
cd backend && uv run pytest tests/api/routes/test_utils.py   # Single test file
cd backend && uv run pytest -k "test_health_check"           # Single test by name
cd backend && uv run ruff check --fix && uv run ruff format # Lint & format

# Frontend
cd frontend && bun run dev                    # Run dev server (port 5173)
cd frontend && bun run build                  # TypeScript check + build
cd frontend && bun run test                   # Run Playwright tests
cd frontend && bun run lint                   # Lint & format with Biome

# Database
cd backend && alembic upgrade head            # Run migrations
cd backend && alembic revision --autogenerate -m "desc"     # Create migration

# API Client (regenerate after backend model changes)
bash scripts/generate-client.sh
```

### Docker Commands
```bash
docker compose -f compose.local.yml up -d     # Start local infra (postgres + adminer)
docker compose -f compose.local.yml down       # Stop local infra
docker compose -f compose.local.yml exec postgres psql -U marketanalysis -d marketanalysis  # DB shell
```

## Domain Context

This is a mobile market analysis dashboard with CopilotKit AI assistant integration.
The domain-specific features are to be implemented.

## Code Style Guidelines

### Python (Backend)

**Imports** - Organized by Ruff/isort (stdlib → third-party → local):
```python
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import SessionDep
```

**Type Hints** - Required everywhere, use modern syntax:
```python
def get_resource(session: SessionDep, resource_id: uuid.UUID) -> Resource | None:
    ...
```

**Naming**:
- Functions/variables: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

**Models** - Use SQLModel with separate schemas:
```python
class ResourceBase(SQLModel):           # Shared fields
    title: str
class ResourceCreate(ResourceBase): pass    # Create request
class ResourcePublic(ResourceBase):         # API response
    id: uuid.UUID
class Resource(ResourceBase, table=True):   # Database table
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
```

**Error Handling**:
```python
from fastapi import HTTPException, status
raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
```

**Docstrings** - Required for API endpoints:
```python
@router.get("/")
def list_resources(session: SessionDep) -> Any:
    """List all resources. Returns paginated results."""
    ...
```

### TypeScript (Frontend)

**Imports** - Organized by Biome (external → aliased → relative):
```typescript
import { useQuery } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
```

**Formatting** (Biome config):
- Double quotes for strings
- No semicolons (except when required)
- 2-space indentation
- Self-closing elements: `<Component />`

**Component Structure**:
```typescript
interface ComponentProps {
  data: SomeData
  isSelected: boolean
  onToggle: (id: string) => void
}

export function Component({ data, isSelected, onToggle }: ComponentProps) {
  return (...)
}
```

**Naming**:
- Components: `PascalCase`
- Functions/variables: `camelCase`
- Types/interfaces: `PascalCase`
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities

**Hooks** - Prefix with `use`:
```typescript
export function useMarketData() { ... }
```

## Project Structure

```
backend/app/
├── api/routes/          # API endpoints (one file per resource)
├── core/                # Config, DB
├── models.py            # All SQLModel schemas
├── services/            # Business logic
└── agent/               # AI agent code (CopilotKit/AG-UI)

frontend/src/
├── client/              # Auto-generated API client (DO NOT EDIT)
├── components/ui/       # shadcn/ui primitives (DO NOT EDIT)
├── components/{Feature}/ # Feature components
├── routes/              # TanStack Router pages
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

## Critical Rules

1. **Never edit `frontend/src/client/`** - Auto-generated from OpenAPI spec
2. **Never edit `frontend/src/components/ui/`** - shadcn/ui managed
3. **Always run `bash scripts/generate-client.sh`** after backend model changes
4. **Always create migrations** for database schema changes
5. **Use dependency injection** via `SessionDep` in routes

## Testing Patterns

### Backend (pytest)
```python
def test_health_check(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/utils/health-check/")
    assert response.status_code == 200
```

### Frontend (Playwright)
```typescript
import { expect, test } from "@playwright/test"

test("shows dashboard", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("Market Analysis Dashboard")).toBeVisible()
})
```

## API Conventions

- All routes prefixed with `/api/v1`
- Use trailing slashes: `/api/v1/resources/`
- Response models: `{Resource}Public` for single, `{Resource}sPublic` for lists
- List responses include `data` array and `count`

## Environment

Key `.env` variables:
- `POSTGRES_*` - Database connection
- `VITE_COPILOT_RUNTIME_URL` - CopilotKit runtime endpoint
