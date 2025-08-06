using System.ComponentModel.DataAnnotations;

namespace datingApp.Classes
{
    public class User
    {
        public int UserId { get; set; }
        public string userName { get; set; }
        public string userEmail { get; set; }
        public string userPassword { get; set; }
        public DateTime birthDate { get; set; }
        public string gender { get; set; }
        public string profileImage { get; set; }
        public string city { get; set; }
        public float latitude { get; set; }
        public float longitude { get; set; }
    }
}
