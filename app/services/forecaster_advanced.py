import pandas as pd
from prophet import Prophet


class MarketForecasterAdvanced:
    def __init__(self, df: pd.DataFrame):
        self.df = df.sort_values('published').copy()

    def get_prophet_forecast(self, category_name: str, periods: int, freq: str = 'D') -> dict | None:
        ts_data = self.df[self.df['category_name'] == category_name]
        ts_data = ts_data.groupby(pd.Grouper(key='published', freq=freq)).size().reset_index(name='y')
        ts_data.rename(columns={'published': 'ds'}, inplace=True)

        if len(ts_data) < 10: return None

        model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
        model.fit(ts_data)
        future = model.make_future_dataframe(periods=periods, freq=freq)
        forecast = model.predict(future)

        return {
            "dates": forecast['ds'].dt.strftime('%Y-%m-%d').tolist(),
            "predicted_demand": forecast['yhat'].round(2).tolist(),
            "confidence_upper": forecast['yhat_upper'].round(2).tolist(),
            "confidence_lower": forecast['yhat_lower'].round(2).tolist(),
            "historical_dates": ts_data['ds'].dt.strftime('%Y-%m-%d').tolist(),
            "historical_demand": ts_data['y'].tolist()
        }