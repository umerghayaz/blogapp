using Microsoft.EntityFrameworkCore;
using blogapp.Models;
using blogapp.Data;

namespace blogapp.Services
{
    public interface IUserService
    {
        Task<User> GetUser(int id); // ✅ Interface Method
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUser(int id) // ✅ Matches Interface
        {
            return await _context.Users.FindAsync(id);
        }
        // public async Task<User>GetUser(string username){
        // return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        // }
    }
}
