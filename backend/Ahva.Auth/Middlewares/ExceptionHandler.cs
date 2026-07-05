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
            _                            => (HttpStatusCode.InternalServerError, "An unexpected error occurred."),
        };

        context.HttpContext.Response.StatusCode = (int)statusCode;
        context.Result = new JsonResult(ApiResponse<object>.Fail(message));
        context.ExceptionHandled = true;
    }
}
