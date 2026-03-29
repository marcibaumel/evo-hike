using evoHike.Backend.Data;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class  AuthController : ControllerBase
    {
        private readonly EvoHikeContext _context;
        public AuthController(EvoHikeContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO request)
        {
            bool emailExist = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExist)
            {
                return BadRequest("This email is already registered.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();


            return Ok("User registered successfully.");
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) {
                return Unauthorized("Invalid email.");
            }
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid password.");
            }
            return Ok("Login successful.");
        }
    }
}