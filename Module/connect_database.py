import psycopg2

def retrieve_database(query):
    # connection = psycopg2.connect("postgres://postgres:password@localhost:5432/verceldb")
    connection = psycopg2.connect(os.getenv('POSTGRES_URL'))

    cursor = connection.cursor()
    cursor.execute(query)
    output = cursor.fetchall()
   
    cursor.close()
    connection.close()
    return output



def update_database(query):

    # connection = psycopg2.connect("postgres://postgres:password@localhost:5432/verceldb")
    connection = psycopg2.connect(os.getenv('POSTGRES_URL'))
    connection.autocommit = True
    cursor = connection.cursor()
    cursor.execute(query)
   
    cursor.close()
    connection.close()

# CREATE TABLE users (  
#               id SERIAL PRIMARY KEY ,
#               first_name VARCHAR(30), 
#               middle_name VARCHAR(30), 
#               last_name VARCHAR(30), 
#               age INT, 
#               phone BIGINT, 
#               email VARCHAR(30), 
#               country VARCHAR(5), 
#               username VARCHAR(30), 
#               passhash VARCHAR, 
#               salt VARCHAR,
#               sess_id VARCHAR,
#               sess_start TIMESTAMP);