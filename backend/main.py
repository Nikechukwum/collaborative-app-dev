from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://keelecollaborative.vercel.app"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# MODEL DATA ////////////
model = joblib.load("xgboost_model.pkl")
scaler = joblib.load("scaler.pkl")
residual_std = joblib.load("residual_std.pkl")
z_score = 1.96
# ///////////////////////

class ForecastRequest(BaseModel):
    current_reg: int
    timeline: float

@app.post("/api/forecast")
def make_prediction(data: ForecastRequest):
    current = data.current_reg
    timeline = data.timeline

    if(timeline >= 0.98):
        return {
            "forecast": current,
            "lower": current,
            "upper": current,
            "sd": residual_std,
        }


    X_new = pd.DataFrame([[timeline, current]], columns=["PctIntoRegPeriod", "CumulativeRegistrations"])
    X_new_scaled = scaler.transform(X_new)
    prediction = model.predict(X_new_scaled)[0]
    prediction = max(current, int(prediction))  # clamp to avoid negatives

    # Intervals
    lower = int(max(current, prediction - z_score * residual_std))
    upper = int(min(prediction + prediction-lower, prediction + z_score * residual_std))
    return {
            "forecast": int(prediction),
            "lower": int(lower),
            "upper": int(upper),
            "sd": residual_std,
        }
