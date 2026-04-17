using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace evoHike.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    /// <summary>
    /// Returns the authenticated user's profile information based on the JWT claims.
    /// </summary>
    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var username = User.Identity?.Name;

        return Ok(new
        {
            Id = userId,
            Username = username,
            Email = email,
            Message = "Token is valid."
        });
    }
}