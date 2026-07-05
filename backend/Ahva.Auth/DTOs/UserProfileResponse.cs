namespace Ahva.Auth.DTOs;

public record UserProfileResponse(
    Guid Id,
    string Username,
    string Email,
    string? FirstName,
    string? PaternalSurname,
    string? MaternalSurname,
    string? DocumentType,
    string? DocumentNumber,
    DateOnly? BirthDate,
    string? Nationality,
    string? Sex,
    string? SecondaryEmail,
    string? MobilePhone,
    string? SecondaryPhoneType,
    string? SecondaryPhone,
    string? ContractType,
    DateOnly? ContractDate
);
