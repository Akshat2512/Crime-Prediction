import subprocess,json, os
from flask import Flask, render_template, request, redirect
from Module.CrimePrediction import prediction
from Module.currentcrime import live_crime_pred
from Module.filterdata import filter_data_for_Analysis

# # from flask_mysqldb import MySQL
# import MySQLdb.cursors


app = Flask(__name__)


@app.route('/env', methods=['POST'])
def read_env():
    postgres_url = os.getenv('POSTGRES_URL')
    postgres_user = os.getenv('POSTGRES_USER')
    postgres_host = os.getenv('POSTGRES_HOST')
    postgres_password = os.getenv('POSTGRES_PASSWORD')
    postgres_database = os.getenv('POSTGRES_DATABASE')
    return render_template(f'{postgres_url}, {postgres_user}')

@app.route('/run_1', methods=['POST'])
def run_1():
    data = request.json
    output = prediction(data)

    return output

@app.route('/run_2', methods=['POST'])
def run_2():
    data = request.json
    # data = json.dumps(data)
    output = filter_data_for_Analysis(data)

    return output

@app.route('/live', methods=['POST'])
def get_current_crime():
    data = request.json

    output = live_crime_pred(data)

    return output

# if __name__ == '__main__':
#         app.run(host='localhost', port=5000, debug=True)
