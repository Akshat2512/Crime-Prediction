
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import sys, json
from datetime import datetime, timedelta


def filter_data_for_Analysis(req_data):
    # req_data = {'city': 'Chicago', 'from': '2023-12-20', 'to':'2023-12-31', 'Ext_type': 'heat-map' }
    # Read data
    data = pd.read_csv(f'Data/{req_data["city"]}_crime_2001_2023.csv')

    data.date = pd.to_datetime(data['date'], format='%Y-%m-%dT%H:%M:%S') 

    fr_date = pd.to_datetime(req_data['from'], format='%Y-%m-%d')
    to_date = pd.to_datetime(req_data['to'], format='%Y-%m-%d')
    to_date = to_date + timedelta(days=1)

    # file = open('PythonFlask/static/GeoJson/temp.json','r')
    # jsn = file.read()
    # jsn = json.loads(jsn)
    jsn = '{'

    if 'boro_nm' in req_data:
        data = data[(data['boro_nm'] == req_data['boro_nm'])]
        
    if req_data['Ext_type'] == 'crime-points': 
      data = data[(data['date']>=fr_date) & (data['date']<=to_date)]
      jsn2='{"type": "FeatureCollection", "features": ['
      
      for _, row in data.iterrows():
          feature = '{"type": "Feature","properties": {"district":"'+ row["boro_nm"]+'", "date":"'+row["date"].strftime('%Y-%m-%d')+'", "ofns_desc":"'+row['ofns_desc']+'", "prem_type":"'+row['prem_typ_desc']+'" },"geometry": {"type": "Point", "coordinates": ['+row['longitude']+','+row['latitude']+']} },'
          jsn2 = jsn2 + feature
      jsn2 = jsn2[:-1] + ']}'

    if req_data['Ext_type'] == 'heat-map' : 
      data = data[(data['date']>=fr_date) & (data['date']<=to_date)]
    
      while(fr_date<to_date):
        # date_from = pd.to_datetime(fr_date, format='%Y-%m-%d')
        df=data[data['date'].dt.date==fr_date.date()]
        count = df['ofns_desc'].value_counts()
        count = count.reset_index()
        count.columns = ['Crime Type', 'Count']

        cn = '{'
        for _, row in count.iterrows():
         cn = cn + '"'+row['Crime Type']+'" : '+  str(row['Count']) +','
        
        cn = cn[:-1] + '}'

        jsn2='{"type": "FeatureCollection", "features": ['

        for _, row in df.iterrows():
        
          properties = '{"date":"'+ row["date"].strftime('%Y-%m-%d')+'","time":"'+ row["date"].strftime('%H:%M:%S')+'","ofns_desc":"'+row['ofns_desc']+'", "prem_type":"'+row['prem_typ_desc']+'"'

          if "block" in row:
            properties = properties + ', "block":"'+ row["block"]+'"}'
          if "boro_nm" in row:
            properties = properties + ', "boro_nm":"'+ row["boro_nm"]+'"}'

          feature = '{"type": "Feature","properties": '+properties+' ,"geometry": {"type": "Point","coordinates": ['+str(row['longitude'])+','+str(row['latitude'])+']}},'
          
          jsn2 = jsn2 + feature


        jsn2 = jsn2[:-1] + '], "counts":'+cn+'}'
        jsn = jsn + '"' + row["date"].strftime('%Y-%m-%d') + '":' + jsn2 +','
        
        fr_date = fr_date + timedelta(days=1)
    jsn = jsn[:-1]+'}'
    return jsn

