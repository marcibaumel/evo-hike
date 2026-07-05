namespace evoHike.Backend.Models.DTO;

public record SendEmailRequest(string Recipient, string Subject, string Body);