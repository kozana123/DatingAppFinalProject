using datingApp.Classes;
using Microsoft.Data.SqlClient;
using System.Data;

namespace datingApp.Models
{
    public class DBMatchService
    {
        static string conStr = "Server=DatingAppSQL.mssql.somee.com;Database=DatingAppSQL;User Id=Dor123_SQLLogin_1;Password=1hlwo2optg;TrustServerCertificate=True;";


        public static bool AddMatch(CreateMatchDto dto)
        {
            string query = @"INSERT INTO matches (User1ID, User2ID, MatchStatus)
                         VALUES (@User1ID, @User2ID, @MatchStatus)";    

            using SqlConnection conn = new SqlConnection(conStr);
            conn.Open();
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@User1ID", dto.User1ID);
            cmd.Parameters.AddWithValue("@User2ID", dto.User2ID);
            cmd.Parameters.AddWithValue("@MatchStatus", dto.MatchStatus);

            int affected = cmd.ExecuteNonQuery();
            return affected > 0;
        }

        public static List<MatchedUserDto> GetMatchedUsers(int userId)
        {
            var matchedUsers = new List<MatchedUserDto>();
            string procedureName = "GetMatchedUsers"; // stored procedure name

            using (SqlConnection conn = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand(procedureName, conn))
            {
                cmd.CommandType = CommandType.StoredProcedure; // <-- IMPORTANT
                cmd.Parameters.AddWithValue("@UserId", userId);

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        matchedUsers.Add(new MatchedUserDto
                        {
                            MatchedWithUserId = reader.GetInt32(0),
                            UserName = reader.GetString(1),
                            ProfileImage = reader.GetString(2)
                        });
                    }
                }
            }

            return matchedUsers;
        }
    }
}
