using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Repositories
{
    public class UserDataAccess : IUserDataAccess
    {
        private readonly EvoHikeContext _context;

        public UserDataAccess(EvoHikeContext context)
        {
            _context = context;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}