using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public TestController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("check-setting")]
    public IActionResult CheckSetting()
    {
        var myVar = _configuration["AppSettings:MyVariable"];
        return Ok(new { StoredValue = myVar });
    }
}
