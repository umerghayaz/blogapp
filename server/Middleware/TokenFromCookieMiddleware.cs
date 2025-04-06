using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace blogapp.Middleware
{
    public class TokenFromCookieMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenFromCookieMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Cookies.ContainsKey("AuthToken"))
            {
                var token = context.Request.Cookies["AuthToken"];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Request.Headers.Authorization = $"Bearer {token}";
                }
            }
            await _next(context);
        }
    }

    public static class TokenFromCookieMiddlewareExtensions
    {
        public static IApplicationBuilder UseTokenFromCookie(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TokenFromCookieMiddleware>();
        }
    }
}