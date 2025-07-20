def adjust_duration_for_gaps(df_grouped, event_date, gap_threshold=30):
    df_grouped = df_grouped.sort_values('CreatedDate').reset_index(drop=True)
    df_grouped['Gap_Days'] = df_grouped['CreatedDate'].diff().dt.days.fillna(0)

    big_gaps = df_grouped[df_grouped['Gap_Days'] > gap_threshold]
    total_gap_days = big_gaps['Gap_Days'].sum()

    adjusted_days_list = []
    adjusted_days = 0

    for i in range(len(df_grouped)):
        if i == 0:
            adjusted_days_list.append(0)
        else:
            gap_days = df_grouped.loc[i, 'Gap_Days']
            if gap_days > gap_threshold:
                adjusted_days += 0  # skip
            else:
                adjusted_days += gap_days
            adjusted_days_list.append(adjusted_days)

    adjusted_total_days = adjusted_days_list[-1]
    if adjusted_total_days <= 0:
        adjusted_total_days = 1

    df_grouped['Adjusted_Days'] = adjusted_days_list
    df_grouped['Cumulative'] = df_grouped['Daily_Registrations'].cumsum()
    final_total = df_grouped['Cumulative'].iloc[-1]

    df_grouped['Pct_Final_Registrations'] = df_grouped['Cumulative'] / final_total
    df_grouped['Pct_Duration_Passed'] = df_grouped['Adjusted_Days'] / adjusted_total_days
    df_grouped['Week_Number'] = (df_grouped['Adjusted_Days'] // 7) + 1

    return df_grouped, int(total_gap_days)