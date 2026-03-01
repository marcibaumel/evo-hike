using evoHike.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace evoHike.Backend.Controllers;
/// <summary>
/// Időjárás előrejelzés kontroller
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController : ControllerBase
{
  
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;
    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }
    /// <summary>
    /// Megadja az időjárás előrejelést az elkövetkező 5 napba
    /// </summary>
    /// <returns>Időjárás előrejelzés adatok</returns>
    /// <response code="200">Visszadja az időjárás előrejelzést</response>
    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            Summaries[Random.Shared.Next(Summaries.Length)]
        ))
        .ToArray();
    }
}