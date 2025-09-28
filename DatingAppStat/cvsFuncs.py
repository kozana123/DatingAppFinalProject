import pyodbc
import pandas as pd
import os
from datetime import date
import sqlalchemy

CONNECTION = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=DatingAppSQL.mssql.somee.com;"
    "DATABASE=DatingAppSQL;"
    "UID=Dor123_SQLLogin_1;"
    "PWD=1hlwo2optg;"
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
NESTED_PATH = os.path.join(SCRIPT_DIR, "Graphs", date.today().strftime('%Y-%m-%d'))

ENGINE = sqlalchemy.create_engine(f"mssql+pyodbc:///?odbc_connect={CONNECTION}")



def get_late_reports( name):

    query = """
    SELECT * 
    FROM View_RecentReports
    ORDER BY ReportDate ASC;"""

    df = pd.read_sql_query(query, ENGINE)

    csv_path = os.path.join(f"{NESTED_PATH}", f'{name}.csv')
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')