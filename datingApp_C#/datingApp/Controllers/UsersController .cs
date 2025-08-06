using datingApp.Models;
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using datingApp;
using Microsoft.Data.SqlClient;
using datingApp.Classes;

[Route("api/[controller]")]
[ApiController]

public class UsersController : ControllerBase
{
    private readonly Cloudinary _cloudinary;
    
    public UsersController()
    {
        var account = new Account(
            "dr9wfscl7",  // Cloud name from your Cloudinary dashboard
            "618543579249246",   // API key
            "GW1AyOnnWpuFcNWTL-XbgDqMv-0"    // API secret 
        );

        _cloudinary = new Cloudinary(account);
    }

    [HttpGet("check-email")]
    public IActionResult CheckEmailExists([FromQuery] string email)
    {
        bool exists = DBUserService.EmailExists(email);
        return Ok(new { exists });
    }

    // POST api/users/register
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(User))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromForm] RegisterUserDto dto)
    {
        try
        {
            if (dto == null || dto.ProfileImageFile == null)
                return BadRequest("Missing user data or image.");

            // Upload the image to Cloudinary
            await using var stream = dto.ProfileImageFile.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(dto.ProfileImageFile.FileName, stream),
                Folder = "DatingAppFinalProject"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                return StatusCode(500, uploadResult.Error.Message);

            // Now build the User object
            var user = new User
            {
                userName = dto.UserName,
                userEmail = dto.UserEmail,
                userPassword = dto.UserPassword,
                birthDate = dto.BirthDate,
                gender = dto.Gender,
                profileImage = uploadResult.SecureUrl.ToString(), // image from Cloudinary
                city = dto.City,
                latitude = dto.Latitude,
                longitude = dto.Longitude
            };

            int newUserId = DBUserService.RegisterUser(user);

            if (newUserId > 0)
            {
                return StatusCode(201, new
                {
                    message = "User registered successfully.",
                    userId = newUserId,
                });
            }

            return StatusCode(500, "Failed to register user.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("login")]
    public IActionResult Login(string email, string password)
    {
        try
        {
            User user = DBUserService.GetUserByEmailAndPassword(email, password);

            if (user == null)
                return NotFound("User not found or invalid credentials.");

            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("update-profile-image/{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateProfileImage([FromForm] UpdateImageDto dto)
    {
       
        try
        {
            if (dto.NewImage == null || dto.UserId <= 0)
                return BadRequest("Missing image or user ID.");
            // Get existing user info (assume this method retrieves a user by ID)
            var user = DBUserService.GetUserById(dto.UserId);
            if (user == null)
                return NotFound("User not found.");

            // Extract public ID from Cloudinary URL to delete the old image
            string oldImageUrl = user.profileImage;
            string publicId = GetCloudinaryPublicId(oldImageUrl);

            if (!string.IsNullOrEmpty(publicId))
            {
                var deleteParams = new DeletionParams(publicId);
                var deleteResult = await _cloudinary.DestroyAsync(deleteParams);

                if (deleteResult.Result != "ok" && deleteResult.Result != "not found")
                    return StatusCode(500, "Failed to delete old image from Cloudinary.");
            }

            // Upload new image
            await using var stream = dto.NewImage.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(dto.NewImage.FileName, stream),
                Folder = "DatingAppFinalProject"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                return StatusCode(500, uploadResult.Error.Message);

            string newImageUrl = uploadResult.SecureUrl.ToString();

            // Update in the DB
            bool updated = DBUserService.UpdateProfileImage(dto.UserId, newImageUrl);

            if (updated)
                return Ok(new { message = "Profile image updated successfully.", newImageUrl });

            return StatusCode(500, "Failed to update user image.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
    private string GetCloudinaryPublicId(string imageUrl)
    {
        try
        {
            // Example: https://res.cloudinary.com/xxx/image/upload/v1629999999/DatingAppFinalProject/abc123.jpg
            var uri = new Uri(imageUrl);
            var parts = uri.AbsolutePath.Split('/');
            var folderAndFilename = string.Join('/', parts.SkipWhile(p => p != "DatingAppFinalProject").ToArray());

            if (folderAndFilename.EndsWith(".jpg") || folderAndFilename.EndsWith(".png"))
                folderAndFilename = Path.ChangeExtension(folderAndFilename, null); // remove extension

            return folderAndFilename; // DatingAppFinalProject/abc123
        }
        catch
        {
            return null;
        }
    }

    [HttpPut("updateLocation/{id}")]
    public IActionResult UpdateLocation(int id, [FromBody] UpdateLocationDto dto)
    {
        try
        {
            bool success = DBUserService.UpdateUserLocation(id, dto.City, dto.Latitude, dto.Longitude);
            if (success)
            {
                return Ok(new { message = "User location updated successfully." });
            }
            else
            {
                return NotFound("User not found.");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        try
        {
            bool success = DBUserService.DeleteUserById(id);
            if (success)
                return Ok(new { message = "User deleted successfully." });
            else
                return NotFound(new { message = "User not found or deletion failed." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
        }
    }
}