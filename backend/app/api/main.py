from fastapi import APIRouter

from app.api.routes import dashboard, indications, utils

api_router = APIRouter()
api_router.include_router(utils.router)
api_router.include_router(indications.router)
api_router.include_router(dashboard.router)
