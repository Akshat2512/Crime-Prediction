import pandas as pd
import numpy as np
from datetime import datetime, timedelta

import holidays
import onnx, onnxruntime as rt

def live_crime_pred(req_data):

    req_data = {'model':'XGBoost', 'city': 'New_York', 'date': '27/08/2024'}

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
    df['holiday'] = df['holiday'].apply(lambda x: 0 if pd.isnull(x) else 1)

    df.set_index('date',inplace=True)

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

    df['season'] = df['season'].astype(np.int32)
    df['weekofyear'] = df['weekofyear'].astype(np.int32)
    df['holiday'] = df['holiday'].astype(np.int32)
      


    FEATURES = ['hour','dayofweek','quarter','month','year',
            'dayofyear','dayofmonth','weekofyear',
            'season', 'holiday']

    df = df[FEATURES]

  # Loading model and prediction using model
    onnx_model = onnx.load(f"Onnx Models/{req_data['city']}_{req_data['model']}.onnx")
    sess = rt.InferenceSession(onnx_model.SerializeToString(), providers=["CPUExecutionProvider"])
    input_name = sess.get_inputs()[0].name
    pred_onx = sess.run(None, {input_name: df.values.astype(np.float32)})


    current = pd.DataFrame({})
    current['prediction'] = pred_onx[0].ravel()

    Date_X = '", "'.join(map(str, df.index))
    Pred = ', '.join(map(str, round(current['prediction'])))
    jsn = '{"dates": '+'["'+Date_X+'"]'+', "predictions":'+'['+Pred+']}'
    
    return jsn

print(live_crime_pred({}))