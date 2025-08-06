using Microsoft.AspNetCore.Mvc;

namespace datingApp
{
    public class FileUploadDto
    {
        [FromForm(Name = "file")]
        public IFormFile File { get; set; }
    }
}
