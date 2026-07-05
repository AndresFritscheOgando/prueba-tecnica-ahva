using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record LoginRequest(
    [Required(ErrorMessage = "El usuario es obligatorio."), MinLength(3, ErrorMessage = "El usuario debe tener al menos 3 caracteres."), MaxLength(50, ErrorMessage = "El usuario no puede tener más de 50 caracteres.")] string Username,
    [Required(ErrorMessage = "La contraseña es obligatoria.")] string Password
);
