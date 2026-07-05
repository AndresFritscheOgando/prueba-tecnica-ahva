namespace Ahva.Auth.Infrastructure.Http;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Error { get; set; }
    public int? RetryAfterMinutes { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "") => new()
    {
        Success = true,
        Data = data,
        Message = message,
    };

    public static ApiResponse<T> Fail(string error) => new()
    {
        Success = false,
        Error = error,
    };
}
