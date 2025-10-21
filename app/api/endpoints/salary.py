from fastapi import APIRouter, Request, HTTPException
from typing import Optional
from ...services.forecaster_advanced import MarketForecasterAdvanced

router = APIRouter()


@router.get("/")
def get_salary_analysis(
        request: Request,
        category: str,  # Обов'язковий параметр для детального аналізу
        experience_min: Optional[int] = 0,
        forecast_days: int = 365,
):
    """Прогноз попиту та детальний аналіз зарплат для категорії."""
    main_df = request.app.state.main_df

    query = f"category_name == '{category}' and experience >= {experience_min}"
    segment_df = main_df.query(query)

    if segment_df.empty:
        raise HTTPException(status_code=404, detail="Дані для фільтрів не знайдено.")

    advanced_forecaster = MarketForecasterAdvanced(main_df)
    demand_forecast = advanced_forecaster.get_prophet_forecast(category, forecast_days)

    salary_by_quartile = segment_df.groupby('salary_quartile')['avg_salary'].agg(
        ['min', 'max', 'median', 'mean']).round(0).reset_index().to_dict(orient='records')
    salary_by_experience = segment_df.groupby('experience')['avg_salary'].median().round(0).reset_index().to_dict(
        orient='records')

    return {
        "demand_forecast": demand_forecast,
        "salary_distribution": {
            "by_quartile": salary_by_quartile,
            "by_experience": salary_by_experience
        }
    }