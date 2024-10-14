import pandas as pd
import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, mean_absolute_percentage_error
# from sklearn import metrics
from datetime import date, timedelta
import holidays
import onnx
import onnxruntime as rt
# import sys, json, joblib

# req_data = json.loads(sys.argv[1])

def prediction(req_data):
    req_data = {"city": "New_York", "model":"XGBoost"}

    df_year=pd.read_csv(f'Data/{req_data["city"]}_2001_2023.csv')
    # print(df_year)

    df_year = df_year.set_index('date')

    df_year.index =  pd.to_datetime(df_year.index,format = '%Y-%m-%d %H:%M:%S')
    df_year = df_year[(df_year.index >='2001') & (df_year.index <='2024') ]




   
    # Create a list of dates from 1 Jan 2023 to 1 Jan 2024
    start_date = df_year.head(1).index.date[0]
    end_date = df_year.tail(1).index.date[0]

    delta = timedelta(days=1)
    dates = []
    while start_date <= end_date:
        dates.append(start_date)
        start_date += delta
    dates.append(start_date)
    # Create a DataFrame
    df_h = pd.DataFrame(dates, columns=['Date'])

    # Get US holidays
    us_holidays = holidays.US(state='NY')

    # Create a column for holidays
    df_h['Holiday'] = df_h['Date'].apply(lambda x: us_holidays.get(x))

    df_h['Date'] = pd.to_datetime(df_h['Date'], format = '%Y-%m-%d')

    df_h.set_index('Date',inplace=True)

    df_h[df_h['Holiday'].isnull()] = 0
    df_h[df_h['Holiday'] != 0] = 1

    df_h = df_h.resample('h').ffill()

    df_h = df_h['Holiday'].astype('int32')
    df_h = df_h.to_frame('Holiday')


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
        df['holiday'] = df_h["Holiday"]
        df=df.dropna()

        return df



    FEATURES = ['hour','dayofweek','quarter','month','year',
              'dayofyear','dayofmonth','weekofyear',
              'season', 'holiday']
    TARGET = 'Crime Count'





    df_n = create_features(df_year)

    X = df_n[FEATURES]# Input variable
    y = df_n[TARGET] # Output variable
    # Split the data into training and testing sets
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=None, shuffle = False)

    test_size = 0.3
    split_index = int(len(X) * (1 - test_size))

    # Split the data (without shuffling)
    X_train, X_test = X.iloc[:split_index], X.iloc[split_index:]
    y_train, y_test = y.iloc[:split_index], y.iloc[split_index:]
    # file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
    # model = joblib.load(file)
    # file.close()
    

    sess = rt.InferenceSession(f"Onnx Models/{req_data['city']}_{req_data['model']}.onnx", providers=["CPUExecutionProvider"])
    input_name = sess.get_inputs()[0].name
    pred_onx = sess.run(None, {input_name: X_test.values.astype(np.float32)})

    test = pd.DataFrame(y_test)

    test['prediction'] = pred_onx[0].ravel()
 
    def mean_squared_error(y_true, y_pred):
      return np.mean((y_true - y_pred) ** 2)

    def mean_absolute_error(y_true, y_pred):
      return np.mean(np.abs(y_true - y_pred))

    def r2_score(y_true, y_pred):
        ss_res = np.sum((y_true - y_pred) ** 2)
        ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
        return 1 - (ss_res / ss_tot)
    

  

    mse = mean_squared_error(test['Crime Count'], test['prediction'])
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(test['Crime Count'], test['prediction'])
    r2 = r2_score(test['Crime Count'], test['prediction'])



    s = test.iloc[[-1]].index.values[0]
    e = np.datetime64('2024-06-30 23:00:00')
    t_append = np.arange(s,e, np.timedelta64(1, "h")) 



    pred_df = pd.DataFrame({'date':t_append[1:]})
    pred_df = pred_df.set_index('date')

    pred_X = create_features(pred_df)
    pred_X = pred_X[FEATURES]

    pred_y = sess.run(None, {input_name: pred_X.values.astype(np.float32)})[0].ravel()


    pred_df = pd.DataFrame({'date':pred_X.index, 'prediction': pred_y})
    test = test.reset_index()
    pred_df = pd.concat([test[['date','prediction']], pred_df], ignore_index=True).copy()
    # print(pred_df)

    if(req_data['city']=='Chicago'):
      X_train = X_train[(X_train.index >= '2017') & (X_train.index <='2017-06-01') ]
      y_train = y_train[(y_train.index >= '2017') & (y_train.index <='2017-06-01')]
      X_test = X_test[(X_test.index >='2017') & (X_test.index <='2017-06-01')]
      y_test = y_test[(y_test.index >='2017') & (y_test.index <='2017-06-01')]
      pred_df = pred_df[pred_df.date<='2017-06-01']

    if(req_data['city']=='New_York'):
      X_train = X_train[(X_train.index >= '2023-08') & (X_train.index <='2024') ]
      y_train = y_train[(y_train.index >= '2023-08') & (y_train.index <='2024')]
      X_test = X_test[(X_test.index >='2023-08') & (X_test.index <='2024')]
      y_test = y_test[(y_test.index >='2023-08') & (y_test.index <='2024')]
      pred_df = pred_df[pred_df.date<='2024']

    Act_X = '", "'.join(map(str, X_train.index))
    Act_y = ', '.join(map(str,pd.DataFrame(y_train)['Crime Count']))

    Test_X =  '", "'.join(map(str, X_test.index))
    Test_y = ', '.join(map(str,pd.DataFrame(y_test)['Crime Count']))

    Pre_X = '", "'.join(map(str, pred_df['date']))
    Pre_y = ', '.join(map(str, pred_df['prediction']))



    Output = '{"Actual": { "X":'+'["'+Act_X+'"]'+', "y":'+'['+Act_y+']'+'}, "Test": {"y_test":'+'['+Test_y+']'+'}, "Predicted": {"X_Pred": '+'["'+Pre_X+'"]'+', "y_pred":'+'['+Pre_y+']'+'}, "MAE":'+str(mae)+', "RMS":'+str(rmse)+', "RSQ":'+str(r2)+', "Model":"'+req_data['model']+'"}'


    return Output



# prediction({})