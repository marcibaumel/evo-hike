using System.ComponentModel.DataAnnotations;

namespace evoHike.Backend.Models.DTO
{
    public class UserLoginDTO
    {
        [Required(ErrorMessage = "Email is required!")]
        [EmailAddress(ErrorMessage = "A valid email address is required!")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Password is required!")]
        public string Password { get; set; } = null!;
    }
}
