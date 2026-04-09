using System.ComponentModel.DataAnnotations;
using evoHike.Backend.Attributes;

namespace evoHike.Backend.Models.DTO
{
    public class UserRegistrationDTO
    {
        [Required (ErrorMessage = "Username is required!")]
        [Length(3, 20, ErrorMessage = "Username must be at least 3 characters long!")]
        public string Username { get; set; } = null!;

        [Required (ErrorMessage = "Email is required!")]
        [EmailAddress (ErrorMessage = "A valid email address is required!")]
        public string Email { get; set; } = null!;

        [Required (ErrorMessage = "Password is required!")]
        [Length(8,100, ErrorMessage = "The password must be at least 8 character long.")]
        [StrongPassword(ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.")]
        public string Password { get; set; } = null!;
    }
}
