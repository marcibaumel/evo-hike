using evoHike.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

using evoHike.Backend.Models.DTO;

namespace evoHike.Backend.Controllers;
[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("test")]
    public async Task<IActionResult> Test(SendEmailRequest sendEmailRequest)
    {
        await _emailService.SendEmail(sendEmailRequest);
        return Ok("Email sikeresn elküldve.");
    }
}