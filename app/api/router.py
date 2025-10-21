from fastapi import APIRouter
from .endpoints import demand, salary, skills, filters

router = APIRouter()

router.include_router(filters.router, prefix="/filters", tags=["Filter Options"])
router.include_router(demand.router, prefix="/demand", tags=["Demand Analysis"])
router.include_router(salary.router, prefix="/salary", tags=["Salary Analysis"])
router.include_router(skills.router, prefix="/skills", tags=["Skills Analysis"])