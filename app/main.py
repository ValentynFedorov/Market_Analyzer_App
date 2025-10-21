from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from .api.router import router as api_router
from .services.data_loader import load_and_prepare_data

app = FastAPI(
    title="IT Market Analysis API",
    description="API для аналізу та прогнозування трендів на IT-ринку України."
)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allows specific origins
    allow_credentials=True,      # Allows cookies (important for future features)
    allow_methods=["*"],         # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],         # Allows all headers
)

@app.on_event("startup")
def startup_event():
    """Завантажує дані при старті сервера."""
    app.state.main_df = load_and_prepare_data("data/synthetic_djinni_vacancies_updated.csv")

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome! Go to /docs for API documentation."}