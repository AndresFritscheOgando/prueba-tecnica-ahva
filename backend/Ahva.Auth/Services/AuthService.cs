using Ahva.Auth.Common.Exceptions;
using Ahva.Auth.Data;
using Ahva.Auth.DTOs;
using Ahva.Auth.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ahva.Auth.Services;

public class AuthService(AppDbContext db, ITokenService tokenService, IConfiguration config) : IAuthService
{
    private static readonly int MaxFailedAttempts = 5;
    private static readonly int LockoutMinutes = 15;

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            throw new ConflictException("Email already in use.");

        if (await db.Users.AnyAsync(u => u.Username == request.Username))
            throw new ConflictException("Username already taken.");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email.ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return await IssueTokens(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == request.Username)
            ?? throw new UnauthorizedAccessException("Invalid username.");

        if (user.LockedUntil.HasValue && user.LockedUntil > DateTime.UtcNow)
        {
            var remaining = (int)Math.Ceiling((user.LockedUntil.Value - DateTime.UtcNow).TotalMinutes);
            throw new AccountLockedException($"Account locked. Try again in {remaining} minute(s).", remaining);
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            user.FailedLoginAttempts++;

            if (user.FailedLoginAttempts >= MaxFailedAttempts)
                user.LockedUntil = DateTime.UtcNow.AddMinutes(LockoutMinutes);

            await db.SaveChangesAsync();
            throw new UnauthorizedAccessException("Invalid password.");
        }

        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;

        return await IssueTokens(user);
    }

    public async Task LogoutAsync(Guid userId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null) return;

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        await db.SaveChangesAsync();
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (user.RefreshTokenExpiry < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token expired.");

        return await IssueTokens(user);
    }

    public async Task<UserProfileResponse> GetProfileAsync(Guid userId)
    {
        var user = await db.Users.FindAsync(userId)
            ?? throw new UnauthorizedAccessException("User not found.");

        return MapToProfile(user);
    }

    public async Task<UserProfileResponse> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await db.Users.FindAsync(userId)
            ?? throw new UnauthorizedAccessException("User not found.");

        var newEmail = request.Email.ToLowerInvariant();
        if (newEmail != user.Email && await db.Users.AnyAsync(u => u.Email == newEmail))
            throw new ConflictException("Email already in use.");

        user.Email = newEmail;
        user.FirstName = request.FirstName;
        user.PaternalSurname = request.PaternalSurname;
        user.MaternalSurname = request.MaternalSurname;
        user.DocumentType = request.DocumentType;
        user.DocumentNumber = request.DocumentNumber;
        user.BirthDate = request.BirthDate;
        user.Nationality = request.Nationality;
        user.Sex = request.Sex;
        user.SecondaryEmail = request.SecondaryEmail;
        user.MobilePhone = request.MobilePhone;
        user.SecondaryPhoneType = request.SecondaryPhoneType;
        user.SecondaryPhone = request.SecondaryPhone;
        user.ContractType = request.ContractType;
        user.ContractDate = request.ContractDate;

        await db.SaveChangesAsync();
        return MapToProfile(user);
    }

    private static UserProfileResponse MapToProfile(User user) => new(
        user.Id, user.Username, user.Email,
        user.FirstName, user.PaternalSurname, user.MaternalSurname,
        user.DocumentType, user.DocumentNumber, user.BirthDate,
        user.Nationality, user.Sex, user.SecondaryEmail,
        user.MobilePhone, user.SecondaryPhoneType, user.SecondaryPhone,
        user.ContractType, user.ContractDate
    );

    private async Task<AuthResponse> IssueTokens(User user)
    {
        var refreshDays = int.Parse(config["Jwt:RefreshTokenDays"] ?? "7");

        user.RefreshToken = tokenService.GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(refreshDays);
        await db.SaveChangesAsync();

        var accessToken = tokenService.GenerateAccessToken(user);
        var expiresIn = int.Parse(config["Jwt:ExpiresInMinutes"] ?? "15") * 60;

        return new AuthResponse(accessToken, user.RefreshToken, expiresIn);
    }
}
