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
    public async Task<IActionResult> Test([FromBody]SendEmailRequest sendMailRequest)
    {
        var response = await _emailService.Send(sendMailRequest);
        if(response.IsSuccessful){
            return Ok("Email sikeresen elküldve");
        }
        return BadRequest($"Hiba történt: {response.StatusCode} - {response.Content} - {response.ErrorMessage}");
    }
}
