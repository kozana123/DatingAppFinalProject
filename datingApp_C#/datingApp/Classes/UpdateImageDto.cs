namespace datingApp.Classes
{
    public class UpdateImageDto
    {
        public int UserId { get; set; }
        public IFormFile NewImage { get; set; }
    }
}
