using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
