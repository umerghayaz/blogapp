using Microsoft.EntityFrameworkCore;
using blogapp.Data;
using blogapp.Services;
using blogapp.Middleware;

var builder = WebApplication.CreateBuilder(args);
// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173/") // React app origin
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// Add services to the container
builder.Services.AddControllers();

// Configure EF Core with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, LogLevel.Warning) // ✅ Show only warnings and errors
);

// Register services
builder.Services.AddScoped<IUserService, UserService>();

// ✅ Use Middleware Configuration
builder.Services.ConfigureAuthenticationAndAuthorization(builder.Configuration);
builder.Services.ConfigureRateLimiting();
builder.Services.ConfigureSession();
builder.Services.AddControllers();
var app = builder.Build();
app.UseCors("AllowReactApp");
app.UseRouting();

// ✅ Apply Middleware
app.UseAppMiddleware();

app.MapControllers();

app.Run();
