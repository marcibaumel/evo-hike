using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class  AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO request)
        {
            await _authService.RegisterAsync(request);
            return Ok("User registered successfully.");
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO request)
        {
            string token = await _authService.LoginAsync(request);
            return Ok(new { message = "Login successful.", token });
        }
    }
}