import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys, json, joblib
import holidays

req_data = json.loads(sys.argv[1])
# req_data = {'model':'XGBoost', 'city': 'New_York', 'date': '2024/08/27'}

curr_time = pd.to_datetime(req_data['date'], format='%d/%m/%Y')

delta = timedelta(days=10)

start_dt = curr_time - delta
end_dt = curr_time + delta


df = pd.DataFrame({'date': [start_dt, end_dt]})
df = df.set_index('date')
df = df.resample('D').sum()
df = df.reset_index()

if req_data['city'] == 'New_York':
 us_holidays = holidays.US(state='NY')

if req_data['city'] == 'Chicago':
 us_holidays = holidays.US(state='IL')

df['holiday'] = df['date'].apply(lambda x: us_holidays.get(x))

df.set_index('date',inplace=True)


df['holiday'] = np.where(df['holiday'].isnull(), 0, 1)

df = df.resample('h').ffill()


def create_features(df_yr):

    df = df_yr.copy()

    df['hour'] = df.index.hour
    df['dayofweek'] = df.index.dayofweek
    # df['weekday'] = df['date'].dt.day_name()
    # df['weekday'] = df['weekday'].map(weekday_mapping)
    df['quarter'] = df.index.quarter
    df['month'] = df.index.month
    df['year'] = df.index.year
    df['dayofyear'] = df.index.dayofyear
    df['dayofmonth'] = df.index.day
    df['weekofyear'] = df.index.isocalendar().week
    df['date_offset'] = (df.index.month*100 + df.index.day - 320)%1300

    df['season'] = pd.cut(df['date_offset'], [0, 300, 602, 900, 1300],
                          labels=[0, 1, 2, 3] # 0 = 'Spring', 1 = 'Summer', 2 = 'Fall', 3 = 'Winter'
                   )
    df=df.dropna()

    return df

df = create_features(df)



file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
model = joblib.load(file)
file.close()

# test = pd.DataFrame(df)

FEATURES = ['hour','dayofweek','quarter','month','year',
          'dayofyear','dayofmonth','weekofyear',
           'season', 'holiday']

df = df[FEATURES]

current = pd.DataFrame({})
current['prediction'] = model.predict(df)



Date_X = '", "'.join(map(str, df.index))
Pred = ', '.join(map(str, round(current['prediction'])))

jsn = '{"dates": '+'["'+Date_X+'"]'+', "predictions":'+'['+Pred+']}'

print(jsn)