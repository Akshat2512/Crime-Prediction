import subprocess,json
from flask import Flask, render_template, request, redirect

# # from flask_mysqldb import MySQL
# import MySQLdb.cursors


app = Flask(__name__)


@app.route('/api/run_1', methods=['POST'])
def run_1():
    data = request.json
    data = json.dumps(data)
    print(output)
    output = subprocess.check_output(['python', 'Module/CrimePrediction.py', data])
    
    return output

@app.route('/api/run_2', methods=['POST'])
def run_2():
    data = request.json
    data = json.dumps(data)
    output = subprocess.check_output(['python', 'Module/filterdata.py', data])

    return output

@app.route('/api/live', methods=['POST'])
def get_current_crime():
    data = request.json
    data = json.dumps(data)
    output = subprocess.check_output(['python', 'Module/currentcrime.py', data])

    return output

# if __name__ == '__main__':
#         app.run(host='localhost', port=5000, debug=True)
