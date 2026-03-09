namespace evoHike.Backend.Models;
using OpenMeteoSDK  = OpenMeteo.Weather.Forecast.ResponseModel.WeatherForecast;
using OpenMeteoSDKHourly = OpenMeteo.Weather.Forecast.ResponseModel.Hourly;

public class OpenWeatherForecastResponse
{
    private readonly OpenMeteoSDKHourly? _hourly;
    private readonly int _count; 

    public OpenWeatherForecastResponse(OpenMeteoSDK? forecast)
    {
        _hourly = forecast?.Hourly;
        _count = _hourly?.Time?.Length ?? 0;
    }
    public bool IsValidForecast()
    {
        
        if (_hourly == null || _count == 0 )
        {
            return false;
        }

        return AreSameLength(
            _count,
            _hourly.Temperature_2m,
            _hourly.Apparent_temperature,
            _hourly.Windspeed_10m,
            _hourly.Relativehumidity_2m,
            _hourly.Precipitation_probability,
            _hourly.Weathercode);

    }

    public OpenWeatherForecast ToWeatherForecast(DateTime apiTime, int index)
    {

        if (index < 0 || index >= _count)
            throw new ArgumentOutOfRangeException(nameof(index));
        
        var h = _hourly!;
        
        return new OpenWeatherForecast
        {
            ForecastDatetime = apiTime,
            TemperatureC = h.Temperature_2m?[index] ?? 0,
            FeelsLikeC = h.Apparent_temperature?[index] ?? 0,
            WindSpeed_ms = (int)(h.Windspeed_10m?[index] ?? 0),
            HumidityPercent = h.Relativehumidity_2m?[index] ?? 0,
            Pop = h.Precipitation_probability?[index] ?? 0,
            WeatherCode = h.Weathercode?[index] ?? 0
        };
    }
    
    private static bool AreSameLength(int expected, params Array?[] arrays)
    {
        return arrays.All(a => a != null && a.Length == expected);
    }
}