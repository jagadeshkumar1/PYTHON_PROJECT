import datetime
import mysql.connector
from mysql.connector import Error

__cnx = None

def get_sql_connection():
    print("Opening mysql connection")
    global __cnx

    try:
        if __cnx is None:
            __cnx = mysql.connector.connect(
                user='root',
                password='root',
                database='grocery_store',
                host='localhost',
                connection_timeout=5,
                pool_name='grocery_pool',
                pool_size=5
            )
        elif not __cnx.is_connected():
            __cnx.reconnect()
            
    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        raise

    return __cnx

def close_connection():
    global __cnx
    if __cnx is not None and __cnx.is_connected():
        __cnx.close()
        __cnx = None
        print("MySQL connection closed.")

