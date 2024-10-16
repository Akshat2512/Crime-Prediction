import subprocess,json, os
from flask import Flask, render_template, request, redirect, Response
from Module.CrimePrediction import prediction
from Module.currentcrime import live_crime_pred
from Module.filterdata import filter_data_for_Analysis

# # from flask_mysqldb import MySQL
# import MySQLdb.cursors


app = Flask(__name__)



@app.route('/run_1', methods=['POST'])
def run_1():
    data = request.json
    output = prediction(data)

    return output

@app.route('/run_2', methods=['POST'])
def run_2():
    data = request.json
    response = filter_data_for_Analysis(data)

    return  Response(response, mimetype='application/json')

@app.route('/live', methods=['POST'])
def get_current_crime():
    data = request.json

    output = live_crime_pred(data)

    return output

# if __name__ == '__main__':
#         app.run(host='localhost', port=5000, debug=True)
