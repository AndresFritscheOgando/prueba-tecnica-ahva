using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record LoginRequest(
    [Required, MinLength(3), MaxLength(50)] string Username,
    [Required] string Password
);
