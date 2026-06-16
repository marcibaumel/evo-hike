using evoHike.Backend.Models.DTO;

namespace evoHike.Backend.Services.Interfaces;

public interface IEmailService
{
    public Task SendEmail(SendEmailRequest sendEmailRequest);
}