using evoHike.Backend.Exceptions;
using System.Net;

namespace evoHike.Backend.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            context.Response.StatusCode = exception switch
            {
                NotFoundException => (int)HttpStatusCode.NotFound,
                UnauthorizedException => (int)HttpStatusCode.Unauthorized,
                ConflictException => (int)HttpStatusCode.Conflict,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var response = new { message = exception.Message };
            return context.Response.WriteAsJsonAsync(response);
        }
    }
}
