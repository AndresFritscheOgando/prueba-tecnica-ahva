using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record RefreshRequest([Required(ErrorMessage = "El token de actualización es obligatorio.")] string RefreshToken);
