from fastapi import APIRouter, Request, HTTPException
from typing import Optional
from ...services.forecaster import MarketForecaster

router = APIRouter()


@router.get("/")
def get_skills_analysis(
        request: Request,
        category: str,
        experience_min: Optional[int] = 0
):
    """Аналіз важливості навичок та їх розподіл по зарплатним квартилям."""
    main_df = request.app.state.main_df

    query = f"category_name == '{category}' and experience >= {experience_min}"
    segment_df = main_df.query(query)

    if segment_df.empty:
        raise HTTPException(status_code=404, detail="Дані для фільтрів не знайдено.")

    forecaster = MarketForecaster(segment_df)
    skill_importance = forecaster.analyze_skills()

    exploded_skills = segment_df.explode('skills')
    top_skills_by_quartile = {}
    for q in ['Q1 (Lowest)', 'Q2', 'Q3', 'Q4 (Top)']:
        top_skills = exploded_skills[exploded_skills['salary_quartile'] == q]['skills'].value_counts().nlargest(5)
        top_skills_by_quartile[q] = top_skills.reset_index().to_dict(orient='records')

    return {
        "skill_importance": skill_importance,
        "top_skills_by_quartile": top_skills_by_quartile
    }