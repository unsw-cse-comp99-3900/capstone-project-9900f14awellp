import sqlite3
import os

direct = os.path.dirname(__file__)
db_path = os.path.join(direct, '../../../InvoiceProcessing/db.sqlite3')

sql_connection = sqlite3.connect(db_path)
exec_cursor = sql_connection.cursor()

exec_cursor.execute('delete from invoice_user where username="test-user";')
# with open('clear_login_test.sql', 'r') as f:
#     sql_script = f.read()

# exec_cursor.executescript(sql_script)

sql_connection.commit()
sql_connection.close()