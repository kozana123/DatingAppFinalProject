using datingApp.Classes;
using Microsoft.Data.SqlClient;

namespace datingApp.Models
{
    public class DBUserService
    {
        //static string conStr = @"Data Source=T67396;Initial Catalog=DatingApp;Integrated Security=True;Trust Server Certificate=True";
        static string conStr = "Server=DatingAppSQL.mssql.somee.com;Database=DatingAppSQL;User Id=Dor123_SQLLogin_1;Password=1hlwo2optg;TrustServerCertificate=True;";


        internal static bool EmailExists(string email)
        {
            using (SqlConnection conn = new SqlConnection(conStr))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM user_details WHERE userEmail = @Email", conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    int count = (int)cmd.ExecuteScalar();
                    return count > 0;
                }
            }
        }
        // הוספת משתמש חדש
        internal static int RegisterUser(User newUser)
        {
            return ExecuteScalarInt(
                $"INSERT INTO user_details (userName, userEmail, user_password, birth_date, gender, profile_image, city,latitude, longitude) " +
                $"VALUES ('{newUser.userName}','{newUser.userEmail}','{newUser.userPassword}', '{newUser.birthDate:yyyy-MM-dd}', '{newUser.gender}', '{newUser.profileImage}', " +
                $"'{newUser.city}', '{newUser.latitude}', '{newUser.longitude}' );" +
                $"SELECT SCOPE_IDENTITY();");
        }

        internal static User GetUserByEmailAndPassword(string email, string password)
        {
            try
            {
                string sql = @"
            SELECT * FROM user_details 
            WHERE userEmail = @Email AND user_password = @Password";

                using SqlConnection con = new SqlConnection(conStr);
                using SqlCommand cmd = new SqlCommand(sql, con);

                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);

                con.Open();
                using SqlDataReader reader = cmd.ExecuteReader();
                
                if (reader.Read())
                {
                    return new User
                    {
                        UserId = (int)reader["user_id"],
                        userName = reader["userName"].ToString(),
                        userEmail = reader["userEmail"].ToString(),
                        userPassword = reader["user_password"].ToString(),
                        birthDate = Convert.ToDateTime(reader["birth_date"]),
                        gender = reader["gender"].ToString(),
                        profileImage = reader["profile_image"].ToString(),
                        city = reader["city"].ToString(),
                        latitude = float.Parse(reader["latitude"].ToString()),
                        longitude = float.Parse(reader["longitude"].ToString())
                    };
                }

                return null;
            }
            catch (SqlException ex)
            {
                throw new Exception("Failed to retrieve user", ex);
            }
        }

       

        internal static bool UpdateProfileImage(int userId, string newImageUrl)
        {
            string query = $"UPDATE user_details SET profile_image = @imageUrl WHERE user_id = @userId";

            try
            {
                using (SqlConnection conn = new SqlConnection(conStr))
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@imageUrl", newImageUrl);
                    cmd.Parameters.AddWithValue("@userId", userId);

                    conn.Open();
                    int affectedRows = cmd.ExecuteNonQuery();
                    return affectedRows > 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error updating profile image: " + ex.Message);
                return false;
            }
        }

        public static User GetUserById(int userId)
        {
            string query = "SELECT * FROM user_details WHERE user_id = @userId";

            try
            {
                using SqlConnection con = new SqlConnection(conStr);
                using SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@userId", userId);

                con.Open();

                using SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    return new User
                    {
                        UserId = (int)reader["user_id"],
                        userName = reader["userName"].ToString(),
                        userEmail = reader["userEmail"].ToString(),
                        userPassword = reader["user_password"].ToString(),
                        birthDate = Convert.ToDateTime(reader["birth_date"]),
                        gender = reader["gender"].ToString(),
                        profileImage = reader["profile_image"].ToString(),
                        city = reader["city"].ToString(),
                        latitude = float.Parse(reader["latitude"].ToString()),
                        longitude = float.Parse(reader["longitude"].ToString())
                    };
                }

                return null;
            }
            catch (SqlException ex)
            {
                throw new Exception("Failed to retrieve user", ex);
            }
        }


        public static bool UpdateUserLocation(int userId, string city, float latitude, float longitude)
        {
            string query = @"UPDATE user_details 
                        SET city = @city, latitude = @latitude, longitude = @longitude 
                        WHERE user_id = @userId";

            using SqlConnection conn = new SqlConnection(conStr);
            conn.Open();
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@city", city);
            cmd.Parameters.AddWithValue("@latitude", latitude);
            cmd.Parameters.AddWithValue("@longitude", longitude);
            cmd.Parameters.AddWithValue("@userId", userId);

            int affected = cmd.ExecuteNonQuery();
            return affected > 0;
        }


        public static bool DeleteUserById(int userId)
        {
            string query = @"
        DELETE FROM user_preferences WHERE user_id = @UserId;
        DELETE FROM user_details WHERE user_id = @UserId;";

            using (SqlConnection conn = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@UserId", userId);
                conn.Open();
                int affectedRows = cmd.ExecuteNonQuery();
                return affectedRows > 0;
            }
        }


        private static int ExecuteScalarInt(string sqlCommand)
        {
            int newId = -1;
            using SqlConnection con = new SqlConnection(conStr);
            SqlCommand cmd = new SqlCommand(sqlCommand, con);
            con.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            if (reader.Read())
                newId = (int)(decimal)reader[0];
            con.Close();
            return newId;
        }




    }
}
