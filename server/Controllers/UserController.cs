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
using System.Runtime.CompilerServices; // For FormattableStringFactory (Option 1)
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
        [HttpGet("getAllUser")]
        [EnableRateLimiting("fixed")]  // Apply rate limiting

        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var sql = @"
            SELECT 
                users.id AS Id, 
                users.username AS name,
                users.email AS email,
                users.password AS Password, 
                users.roleId AS RoleId,
                roles.Name AS RoleName
            FROM users
            INNER JOIN roles ON roles.id = users.roleId
        ";

                // Get all users using ToListAsync
                var users = await _context.Database
                    .SqlQuery<UserWithDetailsDto>(FormattableStringFactory.Create(sql))
                    .ToListAsync();  // Use ToListAsync instead of FirstOrDefaultAsync to fetch all users

                if (users == null || !users.Any())
                    return StatusCode(404, new { message = "No Users Found!" });

                // Exclude password and return only necessary fields
                var userResponses = users.Select(user => new
                {
                    user.Id,
                    user.name,
                    user.email,
                    user.RoleId,
                    user.RoleName
                }).ToList();

                return StatusCode(200, new { message = "Users fetched successfully", users = userResponses });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during fetching users.", error = ex.Message });
            }
        }


        // 📌 GET USER BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {

         try
            {
                var sql = @"
                    SELECT 
                        users.id AS Id, 
                        users.username AS name,
                        users.email AS email,
                        users.password AS Password, 
                        users.roleId AS RoleId,
                        roles.Name AS RoleName
                    FROM users
                    INNER JOIN roles ON roles.id = users.roleId
                    WHERE users.id = {0}";

                var user = await _context.Database
                    .SqlQuery<UserWithDetailsDto>(FormattableStringFactory.Create(sql, id))
                    .FirstOrDefaultAsync();

                // var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                    return StatusCode(404, new { message = "User Does Not Exist!" });
                var userResponse = new
                {
                    user.Id,
                    user.name,
                    user.email,
                    user.RoleId,
                    user.RoleName
                };
                return StatusCode(200, new { message = "Login successful", user = userResponse });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login.", error = ex.Message });
            }  
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
        public async Task<IActionResult> UpdateUser(int id,  [FromBody] UserWithDetailsDto user)
        {
            try
            {
                if (user == null)
                    return BadRequest(new { message = "Invalid user data." });
                // Try to find the existing user
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

                if (existingUser == null)
                    return NotFound(new { message = $"No user found with ID {id}. Please check the ID and try again." });

                if (!string.IsNullOrEmpty(user.email))
                {
                    existingUser.Email = user.email;
                }
                if (!string.IsNullOrEmpty(user.name))
                {
                    existingUser.Username = user.name;
                }
                      if (user.RoleId.HasValue)
        {
            existingUser.RoleId = user.RoleId.Value;
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
                var sql = @"
                    SELECT 
                        users.id AS Id, 
                        users.username AS name,
                        users.email AS email,
                        users.password AS Password, 
                        users.roleId AS RoleId,
                        roles.Name AS RoleName
                    FROM users
                    INNER JOIN roles ON roles.id = users.roleId
                    WHERE users.email = {0}";

                var user = await _context.Database
                    .SqlQuery<UserWithDetailsDto>(FormattableStringFactory.Create(sql, request.Email))
                    .FirstOrDefaultAsync();

                // var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
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
                var userResponse = new
                {
                    user.Id,
                    user.name,
                    user.email,
                    user.RoleId,
                    user.RoleName
                };
                return StatusCode(200, new { message = "Login successful", token = token, user = userResponse });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login.", error = ex.Message });
            }
        }

        private async Task<string> GenerateJwtToken(UserWithDetailsDto user)

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
        new Claim(ClaimTypes.Email, user.email),
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
         [HttpPost("logout")]
    public IActionResult Logout()
    {
        var refreshToken = Request.Cookies["AuthToken"];

        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest(new { message = "No refresh token found" });
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            tokenHandler.ValidateToken(refreshToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            // Clear cookies
            Response.Cookies.Delete("AuthToken");

            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            Console.WriteLine("Invalid Refresh Token: " + ex.Message);
            return BadRequest(new { message = "Invalid refresh token" });
        }
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
public class UserWithDetailsDto
{
    public int Id { get; set; }
    public string? name { get; set; }  // Nullable
    public string? email { get; set; }
    public string? Password { get; set; } // ✅ New column
    public int? RoleId { get; set; }

    // Role details from the JOIN
    public string? RoleName { get; set; }
}
