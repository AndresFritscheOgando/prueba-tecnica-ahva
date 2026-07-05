using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record RegisterRequest(
    [Required(ErrorMessage = "El usuario es obligatorio."), MinLength(3, ErrorMessage = "El usuario debe tener al menos 3 caracteres."), MaxLength(50, ErrorMessage = "El usuario no puede tener más de 50 caracteres.")] string Username,
    [Required(ErrorMessage = "El correo electrónico es obligatorio."), EmailAddress(ErrorMessage = "El correo electrónico no es válido.")] string Email,
    [Required(ErrorMessage = "La contraseña es obligatoria."), MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")] string Password
);
