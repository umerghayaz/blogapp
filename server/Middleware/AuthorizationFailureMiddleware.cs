using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Text;

namespace blogapp.Middleware
{
    public static class AppMiddlewareConfig
    {
        /// <summary>
        /// Configures JWT Authentication and Authorization Policies
        /// </summary>
        public static void ConfigureAuthenticationAndAuthorization(this IServiceCollection services, IConfiguration configuration)
        {
            var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]);

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["Jwt:Issuer"],
                        ValidAudience = configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnChallenge = async context =>
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(
                                new { message = "You are not authorized. Please provide a valid token." }));
                            context.HandleResponse();
                        },
                        OnForbidden = async context =>
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(
                                new { message = "You do not have permission to access this resource." }));
                        }
                    };
                });

            // Configure Authorization Policies
            services.AddAuthorization(options =>
            {
                options.AddPolicy("CreateUser", policy => policy.RequireClaim("Permission", "CreateUser"));
                options.AddPolicy("ReadUser", policy => policy.RequireClaim("Permission", "ReadUser"));
                options.AddPolicy("UpdateUser", policy => policy.RequireClaim("Permission", "UpdateUser"));
                options.AddPolicy("DeleteUser", policy => policy.RequireClaim("Permission", "DeleteUser"));
                options.AddPolicy("AdminAccess", policy => policy.RequireRole("Admin"));
            });
        }
        /// <summary>
        /// Configures Session Services
        /// </summary>
        public static void ConfigureSession(this IServiceCollection services)
        {
            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
        }

        /// <summary>
        /// Configures Rate Limiting
        /// </summary>
        public static void ConfigureRateLimiting(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                options.AddFixedWindowLimiter("fixed", opt =>
                {
                    opt.PermitLimit = 5;  // Allow 5 requests
                    opt.Window = TimeSpan.FromSeconds(10); // Per 10 seconds
                });
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            });
        }

        /// <summary>
        /// Applies Middleware in the Application Pipeline
        /// </summary>
        public static void UseAppMiddleware(this IApplicationBuilder app)
        {
            app.UseSession();
            app.UseMiddleware<TokenFromCookieMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseRateLimiter();
        }
    }
}
