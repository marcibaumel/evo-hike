using System.Net;
using System.Net.Mail;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace evoHike.Backend.Services;

public class GmailService : IEmailService
{
    private readonly GmailOptions _gmailOptions;

    public GmailService(IOptions<GmailOptions> gmailOptions)
    {
        _gmailOptions = gmailOptions.Value;
    }

    public async Task SendEmail(SendEmailRequest sendEmailRequest)
    {
        using var mailMessage = new MailMessage
        {
            From = new MailAddress(_gmailOptions.Email),
            Subject = sendEmailRequest.Subject,
            Body = sendEmailRequest.Body,
        };
        mailMessage.To.Add(sendEmailRequest.Recipient);
        using var smtpClient = new SmtpClient();

        smtpClient.Host = _gmailOptions.Host;
        smtpClient.Port = _gmailOptions.Port;
        smtpClient.Credentials = new NetworkCredential(_gmailOptions.Email, _gmailOptions.Password);
        smtpClient.EnableSsl = true;

        try
        {
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            throw new Exception("Couldn't send the mail:" + ex.Message);
        }
    }   

}