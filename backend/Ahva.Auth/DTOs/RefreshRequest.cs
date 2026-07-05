using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record RefreshRequest([Required] string RefreshToken);
