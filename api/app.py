import subprocess,json
from flask import Flask, render_template, request, redirect
from Module.currentcrime import current_crime_prediction
from Module.filterdata import filter_data_for_Analysis
# # from flask_mysqldb import MySQL
# import MySQLdb.cursors


app = Flask(__name__)


@app.route('/run_1', methods=['POST'])
def run_1():
    data = request.json
    data = json.dumps(data)
    
    output = subprocess.check_output(['python', 'Module/CrimePrediction.py', data])
    print(output)
    return output

@app.route('/run_2', methods=['POST'])
def run_2():
    data = request.json
    data = json.dumps(data)
    output = filter_data_for_Analysis(['python', 'Module/filterdata.py', data])

    return output

@app.route('/live', methods=['POST'])
def get_current_crime():
    data = request.json

    output = curr_crime_prediction(data)

    return output

# if __name__ == '__main__':
#         app.run(host='localhost', port=5000, debug=True)
