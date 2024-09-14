import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, mean_absolute_percentage_error
import seaborn as sns
from sklearn import metrics

import sys, json, joblib


req_data = {"city": "New_York", "model":"XGBoost"}
df_year=pd.read_csv(f'static/Data/{req_data["city"]}_2001_2023.csv')

# print(df_year)

df_year = df_year.set_index('date')

df_year.index =  pd.to_datetime(df_year.index,format = '%Y-%m-%d %H:%M:%S')
df_year = df_year[(df_year.index >='2001') & (df_year.index <='2024') ]



from datetime import date, timedelta
import pandas as pd
import holidays

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
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=None, shuffle = False)


if req_data['city'] == 'Chicago':
    if req_data['model'] == 'XGBoost':
      from xgboost import XGBRegressor

      model =  XGBRegressor( base_score=0.5, booster= 'gbtree',objective='reg:squarederror',
                            n_estimators=346,
                        early_stopping_rounds=10,
                          max_depth=11,
                          learning_rate =0.0091, enable_categorical=True)
                          # Train the model
      model.fit(X_train, y_train,
          eval_set=[(X_train, y_train), (X_test, y_test)],
            verbose=False)

      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()

    elif req_data['model'] == 'Decision_Tree':
      from sklearn.tree import DecisionTreeRegressor

      model = DecisionTreeRegressor(max_features=0.7,
                          max_depth=13, min_samples_leaf=20)
      np.random.seed(0)
      model.fit(X_train, y_train)
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()
    
    elif req_data['model'] == 'Light_GBM':
      import lightgbm as lgb

      model = lgb.LGBMRegressor(force_col_wise=True, n_estimators=400,
                          max_depth=14,
                          learning_rate =0.01, num_leaves=150, verbose=-1)

      model.fit(X_train, y_train, eval_metric='rmse', eval_set=[(X_train, y_train)])
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()

    elif req_data['model'] == 'Random_Forest':
      from sklearn.ensemble import RandomForestRegressor

      model = RandomForestRegressor( max_features=0.7,
                n_estimators=346,
                     max_depth=13, min_samples_leaf=20
                     )
      np.random.seed(0)
      model.fit(X_train, y_train)

      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()

    elif req_data['model'] == 'Linear':
      from sklearn.linear_model import LinearRegression

      model = LinearRegression()
      model.fit(X_train, y_train)
      
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()

if req_data['city'] == 'New_York':
    if req_data['model'] == 'XGBoost':
      from xgboost import XGBRegressor

      model = XGBRegressor( base_score=0.5, booster= 'gbtree',objective='reg:squarederror',
                            n_estimators=346,
                        early_stopping_rounds=10,
                          max_leaves=30,
                          learning_rate = 0.01, enable_categorical=True)  

      model.fit(X_train, y_train,
          eval_set=[(X_train, y_train), (X_test, y_test)],
            verbose=False)
            
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()

    elif req_data['model'] == 'Decision_Tree':
      from sklearn.tree import DecisionTreeRegressor

      model = DecisionTreeRegressor(max_features=0.7,
                          max_depth=20, min_samples_leaf=30)
      np.random.seed(0)
      model.fit(X_train, y_train)
      
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()
    
    elif req_data['model'] == 'Light_GBM':
      import lightgbm as lgb

      model = lgb.LGBMRegressor(force_col_wise=True, n_estimators=240, early_stopping_rounds=10,
                     max_depth=15, learning_rate =0.01, num_leaves=30, verbose=-1)

      model.fit(X_train, y_train, eval_metric='rmse', eval_set=[(X_train, y_train)])
      
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()

    elif req_data['model'] == 'Random_Forest':
      from sklearn.ensemble import RandomForestRegressor

      model = RandomForestRegressor( max_features=0.7,
                      n_estimators=1000,
                          max_depth=15, min_samples_leaf=30
                          )

      model.fit(X_train, y_train)
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()
    
    elif req_data['model'] == 'Linear':
      from sklearn.linear_model import LinearRegression

      model = LinearRegression()
      model.fit(X_train, y_train)

      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'wb')
      joblib.dump(model, file)
      file.close()
      file = open(f'Models/{req_data["city"]}_{req_data["model"]}.joblib', 'rb')
      model = joblib.load(file)
      file.close()