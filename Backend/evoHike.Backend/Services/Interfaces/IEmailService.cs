using evoHike.Backend.Models.DTO;
using RestSharp;
using System.Threading.Tasks;

namespace evoHike.Backend.Services.Interfaces;

public interface IEmailService
{
    public Task<RestResponse> Send(SendEmailRequest sendMailRequest);
}
