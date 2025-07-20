import pandas as pd
import numpy as np
import os
from sklearn.model_selection import cross_val_score
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
import joblib

def process_event(csv_path, event_name):
    try:
        df = pd.read_csv(csv_path, skiprows=1)
        df.columns = df.columns.str.strip()
        df = df.rename(columns={
            "Created Date": "CreatedDate",
            "BookingReference": "BookingReference",
            "Reference": "Reference",
            "Attendee Status": "AttendeeStatus",
            "Attended": "Attended"
        })
        df["CreatedDate"] = pd.to_datetime(df["CreatedDate"], dayfirst=True, errors="coerce")
        df = df.dropna(subset=["CreatedDate"])
        daily_counts = df.groupby("CreatedDate").size().reset_index(name="DailyRegistrations")
        daily_counts["CumulativeRegistrations"] = daily_counts["DailyRegistrations"].cumsum()
        daily_counts["PctIntoRegPeriod"] = (daily_counts.index + 1) / len(daily_counts)
        final_total = daily_counts["CumulativeRegistrations"].iloc[-1]
        daily_counts["FinalRegistrations"] = final_total
        daily_counts["Event"] = event_name
        return daily_counts[["Event", "PctIntoRegPeriod", "CumulativeRegistrations", "FinalRegistrations"]]
    except Exception as e:
        print(f"Failed to process {csv_path}: {e}")
        return None

# === AUTO-LOAD CSVs from folder ===
event_folder = "events"  # Adjust to your folder
all_snapshots = []

for filename in os.listdir(event_folder):
    if filename.endswith(".csv"):
        path = os.path.join(event_folder, filename)
        event_name = os.path.splitext(filename)[0]
        snapshot = process_event(path, event_name)
        if snapshot is not None:
            all_snapshots.append(snapshot)

if not all_snapshots:
    raise ValueError("No valid event files found!")

df_all = pd.concat(all_snapshots, ignore_index=True)
print(f"Loaded {len(df_all)} snapshots from {len(all_snapshots)} event files.")

# === FEATURES & MODEL ===
X = df_all[["PctIntoRegPeriod", "CumulativeRegistrations"]]
y = df_all["FinalRegistrations"]

# Tree-based models don't need scaling, but safe to include
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

model.fit(X_scaled, y)

# === RESIDUALS CALCULATION ===
y_pred_train = model.predict(X_scaled)
residuals = y - y_pred_train
residual_std = np.std(residuals)

# SAVE TRAINING DATA
joblib.dump(model, "xgboost_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(residual_std, "residual_std.pkl")

cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring="neg_mean_absolute_error")
cv_mae = -cv_scores.mean()
in_sample_mae = mean_absolute_error(y, model.predict(X_scaled))

print("In-sample MAE:", round(in_sample_mae, 2))
print("Cross-validated MAE:", round(cv_mae, 2))

# === PREDICTION FUNCTION ===
def predict_final(pct_progress, registrations_so_far, z_score):
    X_new = pd.DataFrame([[pct_progress, registrations_so_far]], columns=["PctIntoRegPeriod", "CumulativeRegistrations"])
    X_new_scaled = scaler.transform(X_new)
    prediction = model.predict(X_new_scaled)[0]
    prediction = max(registrations_so_far, int(prediction))  # clamp to avoid negatives

    # Intervals
    lower = int(max(registrations_so_far, prediction - z_score * residual_std))
    upper = int(prediction + z_score * residual_std)
    return (f"Time into reg: {pct_progress*100}%, Current: {registrations_so_far} regs, \n==============\nFORECAST: {prediction}, lower: {lower}, upper: {upper}")


# === TEST PREDICTION ===
result = predict_final(0.25, 315, 1.96)
print(result)
