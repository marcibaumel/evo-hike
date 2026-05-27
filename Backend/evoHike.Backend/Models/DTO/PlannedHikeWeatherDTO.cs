namespace evoHike.Backend.Models.DTO;

public class PlannedHikeWeatherDTO
{
    public int PlannedHikeId { get; set; }
    public string TrailName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public bool IsWeatherDangerous { get; set; }
    public string? DangerWarning { get; set; }
    public List<OpenWeatherForecast>? Forecasts { get; set; }
}