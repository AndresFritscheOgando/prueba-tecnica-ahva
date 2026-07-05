using System.ComponentModel.DataAnnotations;

namespace Ahva.Auth.DTOs;

public record UpdateProfileRequest(
    [Required, EmailAddress] string Email,
    string? FirstName,
    string? PaternalSurname,
    string? MaternalSurname,
    string? DocumentType,
    string? DocumentNumber,
    DateOnly? BirthDate,
    string? Nationality,
    string? Sex,
    [EmailAddress] string? SecondaryEmail,
    string? MobilePhone,
    string? SecondaryPhoneType,
    string? SecondaryPhone,
    string? ContractType,
    DateOnly? ContractDate
);
