using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using blogapp.Data;
using blogapp.Models;
using blogapp.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
namespace blogapp.Controllers

{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase

    {
        private readonly IUserService _userService;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(IUserService userService, AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _userService = userService;
            _configuration = configuration;
        }

        // 📌 GET ALL USERS
        [Authorize(Policy = "AdminAccess")] // ✅ Only Admins can read all users
        [HttpGet]
        [EnableRateLimiting("fixed")]  // Apply rate limiting

        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // 📌 GET USER BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id, [FromBody] User body)
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }
        // 📌 CREATE A NEW USER
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userExist = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (userExist != null)
                    return StatusCode(409, new { message = "User Already Exist" });

                var user = new User
                {
                    Username = dto.Username,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    RoleId = dto.RoleId
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { message = "User Created Successfully", userId = user.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the user.", error = ex.Message });
            }
        }


        // 📌 UPDATE USER BY ID
        [HttpPut("{id}")]
        [Authorize(Policy = "UpdateUser")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            try
            {
                if (user == null)
                    return BadRequest(new { message = "Invalid user data." });
                // Try to find the existing user
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

                if (existingUser == null)
                    return NotFound(new { message = $"No user found with ID {id}. Please check the ID and try again." });

                if (!string.IsNullOrEmpty(user.Email))
                {
                    existingUser.Email = user.Email;
                }
                if (!string.IsNullOrEmpty(user.Username))
                {
                    existingUser.Username = user.Username;
                }
                if (user.RoleId != 0)
                {
                    existingUser.RoleId = user.RoleId;
                }
                if (!string.IsNullOrEmpty(user.Password))
                {
                    existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                }
                await _context.SaveChangesAsync();

                return Ok(new { message = " User Updated Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the user.", error = ex.Message });
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                    return StatusCode(404, new { message = "User Does Not Exist!" });

                // Check password validity
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
                if (!isPasswordValid)
                    return StatusCode(401, new { message = "Invalid credentials" });

                // Generate JWT token
                var token = await GenerateJwtToken(user);
                Response.Cookies.Append("AuthToken", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(1) // Match JWT expiration
                });
                return StatusCode(200, new { message = "Login successful", token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login.", error = ex.Message });
            }
        }

        private async Task<string> GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
            {
                throw new InvalidOperationException("JWT configuration is missing or invalid in appsettings.json");
            }
            var permissions = await GetUserPermissions(user.Id); // ✅ Proper async call

            Console.WriteLine($"Role: {permissions.RoleName}");
            Console.WriteLine($"Permissions: {string.Join(", ", permissions.Permissions)}");

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, permissions.RoleName), // ✅ Corrected
    };
            claims.AddRange(permissions.Permissions.Select(p => new Claim("Permission", p))); // ✅ Corrected
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        [HttpGet("permission/{userId}")]
        public async Task<UserRolePermissionsDto> GetUserPermissions(int userId)
        {
            var userData = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserRolePermissionsDto
                {
                    RoleName = u.Role.Name,  // Fetch Role Name
                    Permissions = u.Role.RolePermissions
                        .Select(rp => rp.Permission.Name)
                        .ToList()
                })
                .FirstOrDefaultAsync();

            return userData;
        }

        [HttpGet("getRole/{userId}")]
        public async Task<object> GetUserWithRole(int userId)
        {
            var result = await _context.Users
                .FromSqlRaw("SELECT u.Id, u.Username, r.Name " +
                            "FROM Users u " +
                            "LEFT JOIN Roles r ON u.RoleId = r.Id " +
                            "WHERE u.Id = {0}", userId)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    RoleName = u.Role != null ? u.Role.Name : null
                })
                .FirstOrDefaultAsync();

            return result;
        }
        // 📌 DELETE USER BY ID
        [HttpDelete("{id}")]
        [Authorize(Policy = "DeleteUser")] // ✅ Permission-based
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null) return NotFound(new { message = $"No user found with ID {id}. Please check the ID and try again." });
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return StatusCode(200, new { message = "User  Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the user.", error = ex.Message });
            }
        }
    };

    // DTO for login request
    public class LoginRequest
    {
        public string Password { get; set; }
        public string Email { get; set; }

    }
}
public class CreateUserDto
{
    public string? Username { get; set; }
    [Required] public string Email { get; set; }
    [Required] public string Password { get; set; }
    [Required] public int RoleId { get; set; }
}
public class UserRolePermissionsDto
{
    public string RoleName { get; set; }
    public List<string> Permissions { get; set; }
}