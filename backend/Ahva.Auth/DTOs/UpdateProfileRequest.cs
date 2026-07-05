using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record UpdateProfileRequest(
    [Required(ErrorMessage = "El correo electrónico es obligatorio."), EmailAddress(ErrorMessage = "El correo electrónico no es válido.")] string Email,
    string? FirstName,
    string? PaternalSurname,
    string? MaternalSurname,
    string? DocumentType,
    string? DocumentNumber,
    DateOnly? BirthDate,
    string? Nationality,
    string? Sex,
    [EmailAddress(ErrorMessage = "El correo electrónico secundario no es válido.")] string? SecondaryEmail,
    string? MobilePhone,
    string? SecondaryPhoneType,
    string? SecondaryPhone,
    string? ContractType,
    DateOnly? ContractDate
);
