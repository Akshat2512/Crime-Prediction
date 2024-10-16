
import pandas as pd
import numpy as np
import json, os
from datetime import datetime, timedelta

import psycopg2


def retrieve_database(query):
    connection = psycopg2.connect(os.getenv('POSTGRES_URL'))
    # connection.autocommit = True
    cursor = connection.cursor()
    cursor.execute(query)
    output = cursor.fetchall()
   
    cursor.close()
    connection.close()
    return output

def filter_data_for_Analysis(req_data):
    # req_data = {'city': 'New_York', 'from': '2023-12-20', 'to':'2023-12-31', 'Ext_type': 'heat-map' }
    # Read data
    # data = pd.read_csv(f'Data/{req_data["city"]}_crime_2001_2023.csv')

    # data.date = pd.to_datetime(data['date'], format='%Y-%m-%dT%H:%M:%S') 

    fr_date = pd.to_datetime(req_data['from'], format='%Y-%m-%d')
    to_date = pd.to_datetime(req_data['to'], format='%Y-%m-%d')
   

    jsn = '{'
    jsn2='{"type": "FeatureCollection", "features": ['
          
    fr_date = pd.to_datetime(req_data['from'], format='%Y-%m-%d')
    to_date = pd.to_datetime(req_data['to'], format='%Y-%m-%d')

        
    while(fr_date<=to_date):

            query = f"SELECT ofns_desc, count(*) from \"{req_data['city']} crimes\" WHERE DATE(date) = '{fr_date}' GROUP BY ofns_desc ORDER BY count DESC;"
            response = retrieve_database(query)
            
            cn = '{'
            for crime_type, counts in response:
                cn = cn + '"'+crime_type+'" : '+  str(counts) +','
            cn = cn[:-1] + '}'
          
            query = f"SELECT * from \"{req_data['city']} crimes\" WHERE DATE(date) = '{fr_date}' ORDER by date;"
            response = retrieve_database(query)

            jsn2='{"type": "FeatureCollection", "features": ['

            for _, date, ofns_desc, prem_type, boro_nm, latitude, longitude in response:
            
                properties = '{"date":"'+ date.strftime('%Y-%m-%d')+'","time":"'+ date.strftime('%H:%M:%S')+'","ofns_desc":"'+ofns_desc+'", "prem_type":"'+prem_type+'", "boro_nm":"'+ boro_nm +'"}'

                feature = '{"type": "Feature","properties": '+properties+' ,"geometry": {"type": "Point","coordinates": ['+str(longitude)+','+str(latitude)+']}},'
                
                jsn2 = jsn2 + feature


            jsn2 = jsn2[:-1] + '], "counts":'+cn+'}'
            jsn = jsn + '"' + date.strftime('%Y-%m-%d') + '":' + jsn2 +','
            
            fr_date = fr_date + timedelta(days=1)
            
    jsn = jsn[:-1]+'}'
    jsn = json.loads(jsn)

    return jsn
