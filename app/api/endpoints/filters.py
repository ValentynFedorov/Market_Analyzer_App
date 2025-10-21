from fastapi import APIRouter, Request
import pandas as pd

router = APIRouter()


@router.get("/options")
def get_filter_options(request: Request):
    """Повертає списки унікальних значень для фільтрів."""
    main_df = request.app.state.main_df

    categories = sorted(main_df['category_name'].unique())

    all_skills = sorted(list(pd.Series([skill for sublist in main_df['skills'] for skill in sublist]).unique()))

    return {
        "categories": categories,
        "skills": all_skills  # <-- Додаємо навички у відповідь
    }