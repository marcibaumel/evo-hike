using evoHike.Backend.Models.DTO;

namespace evoHike.Backend.Services
{
    public interface IAuthService
    {
        Task<string?> RegisterAsync(UserRegistrationDTO request);
        Task<string?> LoginAsync(UserLoginDTO request);
    }
}
