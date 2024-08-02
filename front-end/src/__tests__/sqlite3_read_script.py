import sqlite3
import os
import sys


direct = os.path.dirname(__file__)
db_path = os.path.join(direct, '../../../InvoiceProcessing/db.sqlite3')

sql_connection = sqlite3.connect(db_path)
exec_cursor = sql_connection.cursor()

exec_cursor.execute(f'delete from invoice_user where username="{sys.argv[1]}";')

sql_connection.commit()
sql_connection.close()

