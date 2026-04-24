using evoHike.Backend.Models;

namespace evoHike.Backend.Repositories
{
    public interface IUserDataAccess
    {
        Task<bool> EmailExistsAsync(string email);
        Task<User?> GetUserByEmailAsync(string email);
        Task AddUserAsync(User user);
    }
}
