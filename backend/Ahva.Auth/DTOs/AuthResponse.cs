namespace Ahva.Auth.DTOs;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn
);
