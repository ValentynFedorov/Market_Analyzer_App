from fastapi import APIRouter, Request, HTTPException
from typing import Optional, List  # <-- Імпортуємо List
from fastapi import Query  # <-- Імпортуємо Query для роботи з масивами
import pandas as pd
from ...services.trend_analyzer import TrendAnalyzer
from ...services.forecaster_advanced import MarketForecasterAdvanced

router = APIRouter()


@router.get("/")
def get_demand_analysis(
        request: Request,
        category: Optional[str] = None,
        experience_min: Optional[int] = None,
        # ✅ Новий параметр: приймаємо список навичок
        skills: Optional[List[str]] = Query(None),
        forecast_days: int = 365
):
    """Аналіз попиту з можливістю фільтрації по навичках."""
    main_df = request.app.state.main_df

    query_parts = []
    if category: query_parts.append(f"category_name == '{category}'")
    if experience_min is not None: query_parts.append(f"experience >= {experience_min}")

    filtered_df = main_df.query(" and ".join(query_parts)) if query_parts else main_df


    if skills:
        # Залишаємо тільки ті рядки, де всі навички з фільтру присутні у вакансії
        filtered_df = filtered_df[filtered_df['skills'].apply(lambda x: all(skill in x for skill in skills))]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="Дані для заданих фільтрів не знайдено.")

    # ... (решта коду ендпоінта залишається без змін)

    demand_ts = filtered_df.groupby(pd.Grouper(key='published', freq='ME')).size()
    demand_forecast = None
    if category:
        advanced_forecaster = MarketForecasterAdvanced(main_df)
        demand_forecast = advanced_forecaster.get_prophet_forecast(
            category_name=category,
            periods=forecast_days
        )
    experience_distribution = filtered_df['experience'].value_counts().reset_index()

    return {
        "historical_demand": {
            "dates": demand_ts.index.strftime('%Y-%m').tolist(),
            "values": demand_ts.values.tolist()
        },
        "experience_distribution": experience_distribution.to_dict(orient='records'),
        "demand_forecast": demand_forecast,
    }