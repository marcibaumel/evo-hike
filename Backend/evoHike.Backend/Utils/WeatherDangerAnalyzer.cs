using evoHike.Backend.Models;

namespace evoHike.Backend.Utils;

public static class WeatherDangerAnalyzer
{
    public static (bool isDangerous, string DangerReason) AnalyzeForecast(IEnumerable<OpenWeatherForecast> forecasts)
    {
        foreach (var forecast in forecasts)
        {
            // WMO: 65: Heavy Rain, 67: Freezing Rain, 75: Heavy Snow, 86: Heavy Snow Showers, 95+: Thunderstorms
            if (forecast.WeatherCode is 65 or 67 or 75 or 86 or >= 95)
                return (true, $"Extreme weather condition expected (WMO Code: {forecast.WeatherCode}) at {forecast.ForecastDatetime:g}.");

            // 17 m/s is approx 60 km/h
            if (forecast.WindSpeed_ms > 17)
                return (true, $"Dangerous high winds expected ({forecast.WindSpeed_ms} m/s) at {forecast.ForecastDatetime:g}");
        }

        return (false, string.Empty);
    }
}