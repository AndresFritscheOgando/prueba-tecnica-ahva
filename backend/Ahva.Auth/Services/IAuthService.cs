using Ahva.Auth.DTOs;

namespace Ahva.Auth.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync(Guid userId);
    Task<AuthResponse> RefreshAsync(RefreshRequest request);
}
