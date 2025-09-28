import pyodbc
import pandas as pd
import os
from datetime import date

CONNECTION = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=T67396;"
    "DATABASE=DatingApp;"
    "Trusted_Connection=yes;"
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
NESTED_PATH = os.path.join(SCRIPT_DIR, "Graphs", date.today().strftime('%Y-%m-%d'))
# NESTED_PATH = f"C:\\Users\Dor Mesika\Desktop\Python\SqlDataProject\Graphs\\{date.today().strftime('%Y-%m-%d')}"


def get_late_reports( name):
    conn = pyodbc.connect(CONNECTION)

    query = """
    SELECT * 
    FROM View_RecentReports
    ORDER BY ReportDate ASC;"""

    df = pd.read_sql_query(query, conn)

    csv_path = os.path.join(f"{NESTED_PATH}", f'{name}.csv')
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')