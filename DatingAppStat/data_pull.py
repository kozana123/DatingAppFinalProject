import graphsFunc
import cvsFuncs
from datetime import date
import os

# NESTED_PATH = r"C:\Users\User\Desktop\Python\DatingAppStat\Graphs"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
NESTED_PATH = os.path.join(SCRIPT_DIR, "Graphs")

def main():
    # print(NESTED_PATH)
    directory_name = date.today().strftime("%Y-%m-%d")
    full_path = os.path.join(NESTED_PATH, directory_name)
    os.makedirs(full_path, exist_ok=True)

    # graphsFunc.get_match_calls("match_calls")
    # graphsFunc.get_amount_of_call_times("amount_of_call_times")

    graphsFunc.get_gender_distribution('Gender Distribution')
    # graphsFunc.get_most_active_cities("most_active_cities")
    # graphsFunc.get_age_division("age_division")
    # graphsFunc.get_distance_preference("distance_preference")

    # graphsFunc.get_amount_of_calls_daily("amount_of_calls_daily")

    # cvsFuncs.get_late_reports("Late Reports")

if __name__ == "__main__":
    main()