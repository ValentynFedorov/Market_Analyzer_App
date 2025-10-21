import pandas as pd
import ast

def _add_salary_quartiles(df: pd.DataFrame) -> pd.DataFrame:
    print("Розраховую зарплатні квартилі...")
    def assign_quartile(series):
        try:
            return pd.qcut(series, 4, labels=['Q1 (Lowest)', 'Q2', 'Q3', 'Q4 (Top)'])
        except ValueError:
            return pd.Series([None] * len(series), index=series.index)
    df['salary_quartile'] = df.groupby('category_name')['avg_salary'].transform(assign_quartile)
    df.dropna(subset=['salary_quartile'], inplace=True)
    return df

def load_and_prepare_data(data_path: str) -> pd.DataFrame:
    print("Завантажую та готую дані...")
    df = pd.read_csv(data_path)
    df['published'] = pd.to_datetime(df['published'], errors='coerce')
    df['category_name'] = df['category'].apply(lambda x: ast.literal_eval(x)['name'])
    df['avg_salary'] = (df['public_salary_min'] + df['public_salary_max']) / 2
    df['skills'] = df['skills'].str.split(', ').fillna('').apply(list)
    df.dropna(subset=['avg_salary', 'published', 'experience'], inplace=True)
    df['experience'] = pd.to_numeric(df['experience'])
    df = _add_salary_quartiles(df)
    print("Дані успішно підготовлено.")
    return df