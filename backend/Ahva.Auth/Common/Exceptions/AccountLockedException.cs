namespace Ahva.Auth.Common.Exceptions;

public class AccountLockedException(string message, int retryAfterMinutes) : Exception(message)
{
    public int RetryAfterMinutes { get; } = retryAfterMinutes;
}
