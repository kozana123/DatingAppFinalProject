namespace datingApp.Classes
{
    public class RegisterUserDto
    {
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public DateTime BirthDate { get; set; }
        public string Gender { get; set; }
        public string City { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }

        public IFormFile ProfileImageFile { get; set; } // the uploaded image
    }
}
