import pandas
import matplotlib.pyplot as plt
import pyodbc
import sqlalchemy
from datetime import date
import os

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

FEMALE_COLOR = "lightpink"
MALE_COLOR = "cornflowerblue"
OTHER_COLOR = "lightgreen"

def save_graph(name):
    os.chdir(f"{NESTED_PATH}")
    plt.savefig(f'{name}.png')

def get_gender_distribution(name):

    try:
        # conn = pyodbc.connect(CONNECTION)

        query = "SELECT * FROM GenderPercentage"
        df = pandas.read_sql_query(query, ENGINE)

        plt.figure(figsize=(6, 6))
        plt.title('Gender Distribution')
        plt.pie(
            df['percentage'],
            labels=df['gender'],
            autopct='%1.1f%%',
            startangle=140,
            colors=[FEMALE_COLOR, MALE_COLOR, OTHER_COLOR]
        )
        plt.axis('equal')
        save_graph(name)

        plt.close()
        # conn.close()

    except Exception as e:
        print("❌ Error:", e)

def get_distance_preference(name):
    try:
        conn = pyodbc.connect(CONNECTION)

        df = pandas.read_sql("""
        SELECT * FROM UserDistanceDistribution
        ORDER BY
        CASE distance_range
        WHEN '0-10 km' THEN 1
        WHEN '10-30 km' THEN 2
        WHEN '30-50 km' THEN 3
        WHEN '50-100 km' THEN 4
        WHEN '100+ km' THEN 5
        END;""", conn)

        df.plot(kind='bar', x='distance_range', y='users_count', color='coral', legend=False)
        plt.title('Distribution of Preferred Search Distance')
        plt.xlabel('Distance Range (km)')
        plt.ylabel('Number of Users')
        plt.xticks(rotation=45)
        plt.tight_layout()

        save_graph(name)

        plt.close()
        conn.close()

    except Exception as e:
        print("❌ Error:", e)

def get_age_division(name):
    try:
        conn = pyodbc.connect(CONNECTION)

        query = "SELECT age_range, gender FROM UserAgeRanges"
        df = pandas.read_sql(query, conn)

        age_gender_dist = df.groupby(['age_range', 'gender']).size().unstack(fill_value=0)
        ordered_ranges = ['18-24', '25-34', '35-44', '45-54', '55+']
        age_gender_dist = age_gender_dist.reindex(ordered_ranges)
        age_gender_dist.plot(kind='bar', color=[FEMALE_COLOR, MALE_COLOR, OTHER_COLOR])

        plt.title('Age Range Distribution by Gender')
        plt.xlabel('Age Range')
        plt.ylabel('Number of Users')
        plt.xticks(rotation=0)
        plt.legend(title='Gender')
        plt.tight_layout()

        save_graph(name)

        plt.close()
        conn.close()

    except Exception as e:
        print("❌ Error:", e)


def get_most_active_cities(name):
    try:
        conn = pyodbc.connect(CONNECTION)

        query = """
        SELECT TOP 5 city_name, users_count
        FROM UsersCountByCity
        ORDER BY users_count DESC   
        """

        df = pandas.read_sql(query, conn)
        df['city_name'] = df['city_name'].apply(reverse_if_hebrew)

        # ציור גרף עוגה
        plt.figure(figsize=(8, 8))
        plt.pie(df['users_count'], labels=df['city_name'], autopct='%1.1f%%', startangle=140,colors=plt.cm.Paired.colors)
        plt.title('Top 5 Cities by Number of Users')
        plt.axis('equal')  # עיגול מושלם

        save_graph(name)
        plt.close()
        conn.close()

    except Exception as e:
        print("❌ Error:", e)


def reverse_if_hebrew(text):
    if text and any('א' <= c <= 'ת' for c in text):
        return text[::-1]
    return text


def get_amount_of_call_times(name):
    try:
        # conn = pyodbc.connect(CONNECTION)

        query = "SELECT DurationRange, COUNT(*) AS CallCount FROM CallsDurationDistribution GROUP BY DurationRange ORDER BY CallCount DESC"

        df = pandas.read_sql(query, ENGINE)

        df.plot(kind='bar', x='DurationRange', y='CallCount', color='teal', legend=False)
        plt.title('Distribution of Call Durations')
        plt.xlabel('Call Duration Range')
        plt.ylabel('Number of Calls')
        plt.xticks(rotation=0)
        plt.tight_layout()
        save_graph(name)

        plt.close()
        # conn.close()

    except Exception as e:
        print("❌ Error:", e)

def get_amount_of_calls_daily(name):
    try:
        conn = pyodbc.connect(CONNECTION)

        query = "SELECT CallHour, ActiveCalls FROM HourlyActivity ORDER BY CallHour"

        df = pandas.read_sql(query, conn)

        # גרף עמודות של פעילות לפי שעה
        plt.figure(figsize=(10, 6))
        plt.plot(df['CallHour'], df['ActiveCalls'], color='mediumpurple', marker = 'o')
        plt.xticks(range(0, 24))
        plt.xlabel('Hour of Day')
        plt.ylabel('Number of Calls')
        plt.title('Hourly Users Activity')
        plt.grid(axis='y', linestyle='--', alpha=0.6)
        plt.tight_layout()
        save_graph(name)

        plt.close()
        conn.close()

    except Exception as e:
        print("❌ Error:", e)

def get_match_calls(name):
    try:
        # conn = pyodbc.connect(CONNECTION)
        query = "SELECT CallDay, TotalCalls, MatchedCalls FROM View_MatchPercentageLast7Days"
        df = pandas.read_sql_query(query, ENGINE)

        # Plot settings
        x = df['CallDay']
        total = df['TotalCalls']
        matched = df['MatchedCalls']

        # Create grouped bar chart
        plt.figure(figsize=(10, 6))
        bar_width = 0.4
        x_pos = range(len(x))

        plt.bar(x_pos, total, width=bar_width, label='Total Calls', color='MediumSeaGreen')
        plt.bar([p + bar_width for p in x_pos], matched, width=bar_width, label='Matched Calls', color='skyblue')

        # Labels and styling
        plt.xlabel('Date')
        plt.ylabel('Number of Calls')
        plt.title('Total vs Matched Calls')
        plt.grid(axis='y', linestyle='--', alpha=0.6)
        plt.xticks([p + bar_width / 2 for p in x_pos], x, rotation=45)
        plt.legend()
        plt.tight_layout()

        save_graph(name)
        plt.close()
        # conn.close()

    except Exception as e:
        print("❌ Error:", e)
