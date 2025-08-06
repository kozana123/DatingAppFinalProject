using System;
using datingApp.Classes;
using Microsoft.Data.SqlClient;

namespace datingApp.Models
{
    public class DBUserPreferencesService
    {
        //static string conStr = @"Data Source=T67396;Initial Catalog=DatingApp;Integrated Security=True;Trust Server Certificate=True";
        static string conStr = "Server=DatingAppSQL.mssql.somee.com;Database=DatingAppSQL;User Id=Dor123_SQLLogin_1;Password=1hlwo2optg;TrustServerCertificate=True;";

        internal static int UserPreferences(UserPreferences prefs)
        {
            try
            {
                string sql = @"
            INSERT INTO user_preferences (
                preferred_partner,
                relationship_type,
                height_preferences,
                religion,
                is_smoker,
                preferred_distance_km,
                min_age_preference,
                max_age_preference,
                interests,
                user_id
            )
            VALUES (
                @PreferredPartner,
                @RelationshipType,
                @HeightPreferences,
                @Religion,
                @IsSmoker,
                @PreferredDistanceKm,
                @MinAgePreference,
                @MaxAgePreference,
                @Interests,
                @UserId
            );
        ";

                using SqlConnection con = new SqlConnection(conStr);
                using SqlCommand cmd = new SqlCommand(sql, con);

                cmd.Parameters.AddWithValue("@PreferredPartner", prefs.PreferredPartner);
                cmd.Parameters.AddWithValue("@RelationshipType", prefs.RelationshipType);
                cmd.Parameters.AddWithValue("@HeightPreferences", prefs.HeightPreferences);
                cmd.Parameters.AddWithValue("@Religion", prefs.Religion);
                cmd.Parameters.AddWithValue("@IsSmoker", prefs.IsSmoker);
                cmd.Parameters.AddWithValue("@PreferredDistanceKm", prefs.PreferredDistanceKm);
                cmd.Parameters.AddWithValue("@MinAgePreference", prefs.MinAgePreference);
                cmd.Parameters.AddWithValue("@MaxAgePreference", prefs.MaxAgePreference);
                cmd.Parameters.AddWithValue("@Interests", prefs.Interests ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UserId", prefs.UserId);

                con.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                con.Close();

                return rowsAffected;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database insert failed", ex);
            }
        }

        internal static UserPreferences GetUserPreferencesByUserId(int userId)
        {
            UserPreferences prefs = null;
            string sql = "SELECT * FROM user_preferences WHERE user_id = @user_id";

            using SqlConnection con = new SqlConnection(conStr);
            using SqlCommand cmd = new SqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@user_id", userId);

            con.Open();
            using SqlDataReader reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                prefs = new UserPreferences
                {
                    UserId = (int)reader["user_id"],
                    PreferredPartner = reader["preferred_partner"].ToString(),
                    RelationshipType = reader["relationship_type"].ToString(),
                    HeightPreferences = reader["height_preferences"].ToString(),
                    Religion = reader["religion"].ToString(),
                    IsSmoker = (bool)reader["is_smoker"],
                    PreferredDistanceKm = (int)reader["preferred_distance_km"],
                    MinAgePreference = (int)reader["min_age_preference"],
                    MaxAgePreference = (int)reader["max_age_preference"],
                    Interests =
                        reader["interests"] == DBNull.Value ? null : reader["Interests"].ToString(),
                };
            }
            con.Close();

            return prefs;
        }

        internal static int UpdateSelectedPreferences(int userId, UserPreferences prefs)
        {
            try
            {
                string sql = @"
            UPDATE user_preferences
            SET
                preferred_partner = @PreferredPartner,
                preferred_distance_km = @PreferredDistanceKm,
                min_age_preference = @MinAgePreference,
                max_age_preference = @MaxAgePreference
            WHERE user_id = @UserId;
        ";

                using SqlConnection con = new SqlConnection(conStr);
                using SqlCommand cmd = new SqlCommand(sql, con);

                cmd.Parameters.AddWithValue("@PreferredPartner", prefs.PreferredPartner ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PreferredDistanceKm", prefs.PreferredDistanceKm);
                cmd.Parameters.AddWithValue("@MinAgePreference", prefs.MinAgePreference);
                cmd.Parameters.AddWithValue("@MaxAgePreference", prefs.MaxAgePreference);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                con.Close();

                return rowsAffected;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database update failed", ex);
            }
        }

        internal static int UserPreferences(int userId, UserPreferences prefs)
        {
            try
            {
                string sql = @"
            UPDATE user_preferences
            SET
                relationship_type = @RelationshipType,
                height_preferences = @HeightPreferences,
                religion = @Religion,
                is_smoker = @IsSmoker,
                interests = @Interests
            WHERE user_id = @UserId;
        ";

                using SqlConnection con = new SqlConnection(conStr);
                using SqlCommand cmd = new SqlCommand(sql, con);

                cmd.Parameters.AddWithValue("@RelationshipType", prefs.RelationshipType);
                cmd.Parameters.AddWithValue("@HeightPreferences", prefs.HeightPreferences);
                cmd.Parameters.AddWithValue("@Religion", prefs.Religion);
                cmd.Parameters.AddWithValue("@IsSmoker", prefs.IsSmoker);
                cmd.Parameters.AddWithValue("@Interests", prefs.Interests);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                con.Close();

                return rowsAffected;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database update failed", ex);
            }
        }
    }
}
