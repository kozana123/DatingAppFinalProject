using datingApp.Classes;
using datingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace datingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPreferencesController : ControllerBase
    {
        // PUT api/userpreferences
        [HttpPost("userPreferences")]
        public IActionResult UpdatePreferences([FromBody] UserPreferences prefs)
        {
            if (prefs == null)
                return BadRequest("Invalid preferences data");

            try
            {
                int rowsAffected = DBUserPreferencesService.UserPreferences(prefs);
                if (rowsAffected > 0)
                    return NoContent();

                return StatusCode(500, "Failed to update preferences");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{userId}")]
        public IActionResult GetPreferences(int userId)
        {
            try
            {
                var prefs = DBUserPreferencesService.GetUserPreferencesByUserId(userId);
                if (prefs == null)
                    return NotFound($"Preferences for user {userId} not found.");

                return Ok(prefs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("editUserPreferences/{userId}")]
        public IActionResult UpdateSerchingPreferences(int userId, [FromBody] UserPreferences prefs)
        {
            if (prefs == null)
                return BadRequest("Invalid preferences data");

            try
            {
                int rowsAffected = DBUserPreferencesService.UpdateSelectedPreferences(userId, prefs);

                if (rowsAffected > 0)
                    return NoContent();

                return NotFound("User not found or no changes made");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("editUserDetails/{userId}")]
        public IActionResult UpdateUserPreferences(int userId, [FromBody] UserPreferences prefs)
        {
            if (prefs == null)
                return BadRequest("Invalid preferences data");

            try
            {
                int rowsAffected = DBUserPreferencesService.UserPreferences(userId, prefs);

                if (rowsAffected > 0)
                    return NoContent();

                return NotFound("User not found or no changes made");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
