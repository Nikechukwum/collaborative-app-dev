import pandas as pd
import numpy as np
import glob
from collections import defaultdict
# import os
# import matplotlib.pyplot as plt
from utils import adjust_duration_for_gaps

# /////////////////////////////////////////////////////
base_path = 'events/'
all_files = glob.glob(base_path + '*.csv')
# print(f"Found {len(all_files)} CSV files.")

event_dates = {
    "D19": "19/11/2019",
    "D21": "09/12/2021",
    "D24": "03/10/2024",
    "GP21": "22/04/2021",
    "GP24": "11/09/2024",
    "NP21": "09/11/2021",
    "NP24": "06/11/2024",
    "MSE21": "24/03/2021",
    "SRM22": "15/06/2022",
    "SRM23": "08/06/2023",
}

audience_map = {
    "IT Managers": ['D19', 'D21', 'D24'],
    "Property Managers": ['GP21', 'GP24', 'NP21', 'NP24'],
    "Education Managers": ['SRM22', 'SRM23'],
    "Education Property Managers": ['GP21', 'GP24', 'NP21', 'NP24', 'SRM22', 'SRM23', 'MSE21'],
    "All": ['D19', 'D21', 'D24', 'GP21', 'GP24', 'NP21', 'NP24', 'SRM22', 'SRM23', 'MSE21'],
}

# /////////////////////////////////////////////////////////////////////////////////////////
event_dfs = {}

for file_path in all_files:
    file_name = file_path.split('.')[0]
    event_code = file_name.split('\\')[1]

    event_date = event_dates.get(event_code)
    if event_date is None:
        print(f"⚠️ No event date for code {event_code}. Skipping.")
        continue

    df = pd.read_csv(file_path, skiprows=1)
    df.columns = ['BookingReference', 'CreatedDate', 'Reference', 'AttendeeStatus', 'Attended']
    df['CreatedDate'] = pd.to_datetime(df['CreatedDate'], dayfirst=True, errors='coerce')
    df = df.dropna(subset=['CreatedDate'])

    grouped = df.groupby('CreatedDate').size().reset_index(name='Daily_Registrations')
    grouped = grouped.sort_values(by='CreatedDate').reset_index(drop=True)
    grouped['Event_Code'] = event_code

    grouped, total_gap_days = adjust_duration_for_gaps(grouped, event_date, gap_threshold=30)

    columns_to_keep = ['CreatedDate', 'Daily_Registrations', 'Cumulative', 'Pct_Duration_Passed',
                       'Pct_Final_Registrations', 'Week_Number', 'Event_Code']
    grouped = grouped[columns_to_keep]

    event_dfs[event_code] = grouped

    # print(f"✅ Processed {event_code}, cumulative: {grouped['Cumulative'].iloc[-1]}, adjusted for {total_gap_days} gap days.")

# //////////////////////////////////////////////////////////////////////////////////
dfs = defaultdict(list)

for audience, codes in audience_map.items():
    for code in codes:
        if code in event_dfs:
            dfs[audience].append(event_dfs[code])
    # print(f"✅ Audience '{audience}': {len(dfs[audience])} events included.")

# ////////////////////////////////////////////////////////////////////////
# save_base_path = 'cleaned/'
# os.makedirs(save_base_path, exist_ok=True)

# for audience, df_list in dfs.items():
#     combined_df = pd.concat(df_list).reset_index(drop=True)
#     save_path = f"{save_base_path}{audience.replace(' ', '_')}_grouped.csv"
#     combined_df.to_csv(save_path, index=False)
#     print(f"💾 Saved: {save_path}")

# ///////////////////////////////////////////////////////////////////////////////

# Standard timeline: from 0% to 100% in 1% increments
standard_pcts = np.linspace(0, 1, 101)

audience_curves = {}

for audience, df_list in dfs.items():
    event_curves = []

    for df in df_list:
        x = df['Pct_Duration_Passed'].values
        y = df['Pct_Final_Registrations'].values

        # Only include events with valid shape
        if len(x) > 1:
            interp_y = np.interp(standard_pcts, x, y, left=0, right=1)
            event_curves.append(interp_y)

    if event_curves:
        stacked = np.vstack(event_curves)
        mean_curve = np.mean(stacked, axis=0)
        std_curve = np.std(stacked, axis=0)

        audience_curves[audience] = {
            'mean': mean_curve,
            'std': std_curve,
            'pcts': standard_pcts,
            'n_events': len(event_curves)
        }

        # print(f"✅ Audience '{audience}': {len(event_curves)} events included in average curve.")
    # else:
        # print(f"⚠️ Audience '{audience}' has no valid events for curve.")

# /////////////////////////////////////////////////////////////////////////////
# for audience, curve_data in audience_curves.items():
#     plt.figure(figsize=(8, 5))
#     plt.plot(curve_data['pcts'] * 100, curve_data['mean'] * 100, label='Average Curve', color='blue')

    # Fill ±1 std deviation
    # plt.fill_between(
    #     curve_data['pcts'] * 100,
    #     (curve_data['mean'] - curve_data['std']) * 100,
    #     (curve_data['mean'] + curve_data['std']) * 100,
    #     color='blue', alpha=0.2, label='±1 Std Dev'
    # )

    # plt.title(f"Average Registration Curve — {audience}")
    # plt.xlabel("% Duration Passed")
    # plt.ylabel("% Registrations")
    # plt.ylim(0, 105)
    # plt.xlim(0, 100)
    # plt.grid(True)
    # plt.legend()
    # plt.show()

# /////////////////////////////////////////////////////////////////
def predict_final_registrations(
    audience,
    current_regs,
    pct_duration_passed=None,
    reg_start_date=None,
    event_date=None,
    today_date=None
):
    """
    Predict final registrations based on audience curve, percent duration passed, or dates.
    If pct_duration_passed not provided, calculates from dates.
    """

    # Check and calculate pct_duration_passed if needed
    if pct_duration_passed is None:
        if reg_start_date and event_date and today_date:
            reg_start = pd.to_datetime(reg_start_date, dayfirst=True)
            event = pd.to_datetime(event_date, dayfirst=True)
            today = pd.to_datetime(today_date, dayfirst=True)

            total_days = (event - reg_start).days
            days_passed = (today - reg_start).days
            if total_days <= 0:
                raise ValueError("Event date must be after registration start date.")
            pct_duration_passed = days_passed / total_days
        else:
            raise ValueError("Either pct_duration_passed or all dates must be provided.")

    # Decide which curve to use
    if audience in audience_curves:
        curve_data = audience_curves[audience]
        print(f"✅ Using curve for audience: {audience}")
    else:
        curve_data = audience_curves["All"]
        print("✅ Audience not specified or unknown, using 'All' curve.")

    mean_curve = curve_data["mean"]
    std_curve = curve_data["std"]
    pcts = curve_data["pcts"]

    expected_pct_reg = np.interp(pct_duration_passed, pcts, mean_curve)
    std_at_pct = np.interp(pct_duration_passed, pcts, std_curve)

    if expected_pct_reg <= 0:
        print("⚠️ Warning: Expected % registrations at this duration is too low. Check input or historical curves.")
        expected_pct_reg = 0.01

    estimated_final = current_regs / expected_pct_reg

    lower_bound = current_regs / min(expected_pct_reg + std_at_pct, 1)
    upper_bound = current_regs / max(expected_pct_reg - std_at_pct, 0.01)

    return {
        "Estimated_Final": int(round(estimated_final)),
        "Range_Lower": int(round(lower_bound)),
        "Range_Upper": int(round(upper_bound)),
        "Expected_Pct_At_Duration": float(expected_pct_reg),
        "Std_At_Duration": float(std_at_pct),
        "Pct_Duration_Passed": pct_duration_passed
    }

# ///////////////////////////////////////////////////////////////////
result = predict_final_registrations(
    audience="IT Managers",
    current_regs=315,
    pct_duration_passed=0.25  # 60% duration passed
)

print(result)
