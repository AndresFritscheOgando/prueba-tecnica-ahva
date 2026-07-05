using System.Net;
using Ahva.Auth.Common.Exceptions;
using Ahva.Auth.Infrastructure.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Ahva.Auth.Middlewares;

public class ExceptionHandler : ExceptionFilterAttribute
{
    public override void OnException(ExceptionContext context)
    {
        var (statusCode, message) = context.Exception switch
        {
            ConflictException ex         => (HttpStatusCode.Conflict,      ex.Message),
            AccountLockedException ex    => (HttpStatusCode.Forbidden,     ex.Message),
            UnauthorizedAccessException ex => (HttpStatusCode.Unauthorized, ex.Message),
            _                            => (HttpStatusCode.InternalServerError, "Ocurrió un error inesperado."),
        };

        var response = ApiResponse<object>.Fail(message);
        if (context.Exception is AccountLockedException locked)
            response.RetryAfterMinutes = locked.RetryAfterMinutes;

        context.HttpContext.Response.StatusCode = (int)statusCode;
        context.Result = new JsonResult(response);
        context.ExceptionHandled = true;
    }
}
