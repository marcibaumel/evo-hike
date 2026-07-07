using System.Net;
using System.Net.Mail;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;
using Microsoft.Extensions.Options;
using System;
using RestSharp;
using RestSharp.Authenticators;
using System.Threading;
using System.Threading.Tasks;

namespace evoHike.Backend.Services;

public class EmailService : IEmailService
{
    private readonly BrevoOptions _brevoOptions;

    public EmailService(IOptions<BrevoOptions> brevoOptions){
        _brevoOptions = brevoOptions.Value;
    }

    public async Task<RestResponse> Send(SendEmailRequest sendMailRequest){
    

    var client = new RestClient("https://api.brevo.com/v3/smtp/email");
    var request = new RestRequest("",Method.Post);
    request.AddHeader("api-key", _brevoOptions.API);
    request.AddHeader("Content-Type", "application/json");

    var payload = new
        {
            sender = new { email = "evosoft.evohike@proton.me", name = "EvoHike" },
            to = new[] { 
                new { email = sendMailRequest.Recipient } 
            },
            subject = sendMailRequest.Subject,
            textContent = sendMailRequest.Body
        };

    request.AddJsonBody(payload);
    var response = await client.ExecuteAsync(request);

    return response;

    }
}
