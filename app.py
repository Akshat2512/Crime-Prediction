import subprocess,json
from flask import Flask, render_template, request, redirect

# from flask_mysqldb import MySQL
import MySQLdb.cursors

import sys
import hashlib
import os
import binascii


db_cred = sys.argv

app = Flask(__name__)

def connect_database():
    # connection = MySQLdb.connect(host=db_cred[1],   // ssh tunnel connection
    #                          port=int(db_cred[2]),
    #                          user=db_cred[3],
    #                          password=db_cred[4],
    #                          db=db_cred[5],
    #                          cursorclass=MySQLdb.cursors.DictCursor)

    # connection = MySQLdb.connect(host='localhost',
    #                              port=3306,
    #                              user='root',
    #                              password='password',
    #                              db='mydb',
    #                              cursorclass=MySQLdb.cursors.DictCursor)

    cursor = connection.cursor()
    return cursor, connection

def encrypt_password(password, salt):
    
    password = password
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
    return render_template('login.html')

@app.route('/authenticate', methods=['POST'])
def login():
    cursor, _ = connect_database()

    username = request.form.get('uname')
    password = request.form.get('pwd')
   
    cursor.execute(f"Select * from users where username = '{username}';")
    rv = cursor.fetchall()
    
    if(len(rv) and username.lower() == rv[0]['username']):
      salt = rv[0]['salt']
      salt = unhex(salt)
      passhash = encrypt_password(password, salt)
      
      if(passhash[0] == rv[0]['passhash']):
        del rv[0]['passhash']
        del rv[0]['salt']
       
        def d(e):
            if rv[0][e] == None:
                return ''
            return rv[0][e]
        return render_template('geocrimes.html', f_name=d('first_name'), m_name=d('middle_name'), l_name=d('last_name'), age=d('age'), email=d('email'), ctr_code=d('country'), ph_no=d('phone'),  u_name=d('username') )
      else:
        return render_template('login.html', username=username, data2 = "Password not correct!!")
    else:
        return render_template('login.html', username=username, data1 = "Username not exist!!")


@app.route('/logout', methods=['POST'])
def logout():
    return render_template('login.html', data = "Logged out")
  


@app.route('/create', methods=['POST'])
def create_user():
    cursor, connection = connect_database()

    req_data = request.json
    print(req_data)
    uname = req_data['username']
    i=0
    
    if(uname):
        get_usr = f"select username from users where username = '{uname}';"
        cursor.execute(get_usr)
        get_usr = cursor.fetchall()
        if(get_usr):
            return "uname exist"
    

    pwd = req_data['password']
    pwd , salt = encrypt_password(pwd, None)
    req_data['password'] = pwd
    req_data['salt'] = salt


    query = f"INSERT INTO `users`(`first_name`, `middle_name`, `last_name`, `age`,  `username`, `passhash`, `email`, `country`, `phone`, `salt` ) VALUES ("

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
        cursor.execute(query)
        connection.commit()
        return "Success"
    except Exception as e:
        print("Error executing query:", str(e))
        return "Failed"


@app.route('/update', methods=['POST'])
def update():
    cursor, connection = connect_database()

    req_data = request.json
    print(req_data)
    uname = req_data['old_uname'].lower()
    data = req_data['data']
    query = "UPDATE `users` SET "

    # old_id = f"select id from users where username = '{uname}'"
    new_id = f"select id from users where username = '{data['username']}'"
    if(uname != data['username']):
      new_id = cursor.execute(new_id)
      if(new_id):
        return 'uname exists'
      

    for x , y in data.items():
      if(y==''):
        query = query + f" {x} = NULL,"
      else:
       query = query + f" {x} = '{y}'," 
  
    query = query[:-1]
    query = query + f" Where username = '{uname}';"
    print(query)
    try:
        cursor.execute(query)
        connection.commit()
        return "Success"
    except Exception as e:
        print("Error executing query:", str(e))
        return "Failed"


@app.route('/ch_pwd', methods=['POST'])
def change_password():
    cursor, connection = connect_database()

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
    
  
    get_usr = f"select * from users where username = '{uname}';"
    if(not cursor.execute(get_usr)):
        return 'not exist'

    get_usr = cursor.fetchall()
    
    o_salt = get_usr[0]['salt'] 
    o_salt = unhex(o_salt)
    o_passhash = get_usr[0]['passhash']
    
    o_pwd = encrypt_password(o_pwd, o_salt)

    if(o_passhash != o_pwd[0]):
       return 'Incorrect!!'
    

    n_pwd, salt = encrypt_password(c_pwd, None)
   
    query = f"UPDATE `users` SET passhash = '{n_pwd}', salt = '{salt}' where username = '{uname}';"
    
    try:
        cursor.execute(query)
        connection.commit()
        return "Success"
    except Exception as e:
        print("Error executing query:", str(e))
        return "Failed"

    


@app.route('/check_user', methods=['POST'])
def check_user():
    cursor, _ = connect_database()
    username = request.json
    
    cursor.execute(f"Select username from users where username = '{username}';")
    
    rv = cursor.fetchall()
    if(rv):
     return "exist"
    return "not exist"


@app.route('/run_1', methods=['POST'])
def run_1():
    data = request.json
    data = json.dumps(data)
    output = subprocess.check_output(['python', 'CrimePrediction.py', data])

    return output

@app.route('/run_2', methods=['POST'])
def run_2():
    data = request.json
    data = json.dumps(data)
    output = subprocess.check_output(['python', 'filterdata.py', data])

    return output

@app.route('/live', methods=['POST'])
def get_current_crime():
    data = request.json
    data = json.dumps(data)
    output = subprocess.check_output(['python', 'currentcrime.py', data])

    return output

if __name__ == '__main__':
        app.run(host='localhost', port=5000, debug=True)
