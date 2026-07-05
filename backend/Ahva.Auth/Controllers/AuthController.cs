using System.Security.Claims;
using Ahva.Auth.DTOs;
using Ahva.Auth.Infrastructure.Http;
using Ahva.Auth.Middlewares;
using Ahva.Auth.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ahva.Auth.Controllers;

[ApiController]
[Route("api/auth")]
[ServiceFilter(typeof(ExceptionHandler))]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var response = await authService.RegisterAsync(request);
        return Ok(ApiResponse<AuthResponse>.Ok(response));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await authService.LoginAsync(request);
        return Ok(ApiResponse<AuthResponse>.Ok(response));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await authService.LogoutAsync(userId);
        return NoContent();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        var response = await authService.RefreshAsync(request);
        return Ok(ApiResponse<AuthResponse>.Ok(response));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var profile = await authService.GetProfileAsync(userId);
        return Ok(ApiResponse<UserProfileResponse>.Ok(profile));
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var profile = await authService.UpdateProfileAsync(userId, request);
        return Ok(ApiResponse<UserProfileResponse>.Ok(profile));
    }
}
