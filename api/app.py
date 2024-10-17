import subprocess,json, os
from flask import Flask, render_template, request, redirect, Response

import hashlib
import binascii
import uuid

from Module.CrimePrediction import prediction
from Module.currentcrime import live_crime_pred
from Module.filterdata import filter_data_for_Analysis, retrieve_database
from Module.connect_database import retrieve_database, update_database

app = Flask(__name__)



def encrypt_password(password, salt):
    
    # password = password
    if(salt==None):
     salt = os.urandom(16)  
    
    salted_password = salt+password.encode()
    hashed_password = hashlib.sha256(salted_password).hexdigest()
    salt = binascii.hexlify(salt).decode()

    return hashed_password, salt

def unhex(salt):
    salt = binascii.unhexlify(salt)
    return salt

   

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/authenticate', methods=['POST'])
def auth_login():

    username = request.form.get('uname')
    password = request.form.get('pwd')
   
    query = f"Select * from users where username = '{username}';"
    rv = retrieve_database(query)

    print(rv)
    if(len(rv) and username.lower() == rv[0][8]):
      salt = rv[0][10]
      salt = unhex(salt)
      passhash = encrypt_password(password, salt)
      
      if(passhash[0] == rv[0][9]):
        def d(e):
            if rv[0][e] == None:
                return ''
            return rv[0][e]
        return render_template('geocrimes.html', f_name=d(1), m_name=d(2), l_name=d(3), age=d(4),ph_no=d(5), email=d(6), ctr_code=d(7), u_name=d(8) )
      else:
        return render_template('index.html', username=username, data2 = "Password not correct!!")
    else:
        return render_template('index.html', username=username, data1 = "Username not exist!!")


@app.route('/logout', methods=['POST'])
def logout():
    return redirect('/')
   
  


@app.route('/create', methods=['POST'])
def create_user():


    req_data = request.json

    uname = req_data['username']
    i=0
    
    if(uname):
        query = f"SELECT username FROM users WHERE username = '{uname}';"
        get_usr = retrieve_database(query)

        if(get_usr):
            return "uname exist"
    

    pwd = req_data['password']
    pwd , salt = encrypt_password(pwd, None)
    req_data['password'] = pwd
    req_data['salt'] = salt


    query = f"INSERT INTO users(first_name, middle_name, last_name, age,  username, passhash, email, country, phone, salt ) VALUES ("

    for x, y in req_data.items():
      i=i+1
      if(y==''):
        query = query + f"NULL,"
      else:
       query = query + f"'{y}'," 

    query = query[:-1]
    query = query + ')'

    print(query)
    try:
        update_database(query)
        return "Success"
    except Exception as e:
        print("Error executing query:", str(e))
        return "Failed"


@app.route('/update', methods=['POST'])
def update():
    
    req_data = request.json
    print(req_data)
    uname = req_data['old_uname'].lower()
    data = req_data['data']
    
    # old_id = f"select id from users where username = '{uname}'"
    query = f"select id from users where username = '{data['username']}'"
    if(uname != data['username']):
      new_id = retrieve_database(query)
      if(new_id):
        return 'uname exists'
      
    query = "UPDATE users SET "

    for x , y in data.items():
      if(y==''):
        query = query + f" {x} = NULL,"
      else:
       query = query + f" {x} = '{y}'," 
  
    query = query[:-1]
    query = query + f" Where username = '{uname}';"
    print(query)
    try:
        update_database(query)
        return "Success"
    except Exception as e:
        print("Error executing query:", str(e))
        return "Failed"


@app.route('/ch_pwd', methods=['POST'])
def change_password():

    data = request.json

    uname = data['username']
    o_pwd = data['o_pwd']
    n_pwd = data['n_pwd']
    c_pwd = data['c_pwd']
    
    if(uname == '' or o_pwd == '' or n_pwd == '' or c_pwd == ''):
      return 'Failed' 

    if(o_pwd == n_pwd):
      return 'same as old'
    if(n_pwd != c_pwd):
      return 'not same'
    
  
    query = f"select * from users where username = '{uname}';"
    get_usr = retrieve_database(query)
    if(not get_usr):
        return 'not exist'


    o_salt = get_usr[0][10] 
    o_salt = unhex(o_salt)
    o_passhash = get_usr[0][9]
    
    o_pwd = encrypt_password(o_pwd, o_salt)

    if(o_passhash != o_pwd[0]):
       return 'Incorrect!!'
    

    n_pwd, salt = encrypt_password(c_pwd, None)
   
    query = f"UPDATE users SET passhash = '{n_pwd}', salt = '{salt}' where username = '{uname}';"
    
    try:
        update_database(query)
        return "Success"

    except Exception as e:
        print("Error executing query:", str(e))
        return "Failed"

    


@app.route('/check_user', methods=['POST'])
def check_user():

    username = request.json
    query = f"Select username from users where username = '{username}';"
    
    rv = retrieve_database(query)
    if(rv):
     return "exist"
    return "not exist"


@app.route('/run_1', methods=['POST'])
def run_1():
    data = request.json
    output = prediction(data)
    
    return output

@app.route('/run_2', methods=['POST'])
def run_2():
    data = request.json
    response = filter_data_for_Analysis(data)
    return response

@app.route('/live', methods=['POST'])
def get_current_crime():
    data = request.json

    output = live_crime_pred(data)

    return output

# if __name__ == '__main__':
#         app.run(host='localhost', port=5000, debug=True)
