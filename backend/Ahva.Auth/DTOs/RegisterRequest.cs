using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record RegisterRequest(
    [Required, MinLength(3), MaxLength(50)] string Username,
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);
