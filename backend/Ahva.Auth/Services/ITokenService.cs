using Ahva.Auth.Entities;

namespace Ahva.Auth.Services;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
