import sqlite3

sql_connection = sqlite3.connect('../../../../InvoiceProcessing/db.sqlite3')
exec_cursor = sql_connection.cursor()

exec_cursor.execute('delete from invoice_user where username="test-user";')
# with open('clear_login_test.sql', 'r') as f:
#     sql_script = f.read()

# exec_cursor.executescript(sql_script)

sql_connection.commit()
sql_connection.close()