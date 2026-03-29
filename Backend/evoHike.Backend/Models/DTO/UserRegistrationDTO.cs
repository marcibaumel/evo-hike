using System.ComponentModel.DataAnnotations;

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
        [Length(6,100, ErrorMessage = "The password must be at least 6 character long.")]
        public string Password { get; set; } = null!;
    }
}
