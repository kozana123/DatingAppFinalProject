using datingApp.Classes;
using datingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace datingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : Controller
    {
        [HttpPost("add")]
        public IActionResult AddMatch([FromBody] CreateMatchDto dto)
        {
            try
            {
                bool success = DBMatchService.AddMatch(dto);
                if (success)
                    return Ok(new { message = "Match added successfully." });
                else
                    return StatusCode(500, "Failed to insert match.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("matched-users/{userId}")]
        public IActionResult GetMatchedUsers(int userId)
        {
            try
            {
                var matchedUsers = DBMatchService.GetMatchedUsers(userId);
                return Ok(matchedUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
