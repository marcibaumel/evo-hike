using System.Runtime.InteropServices.JavaScript;
using OpenMeteo.Geocoding;
using OpenMeteo.Weather.Forecast.Options;
using evoHike.Backend.Models;
using Microsoft.Extensions.Caching.Memory;
using OpenMeteo;

namespace evoHike.Backend.Services;

public class WeatherService(OpenMeteoClient client, IMemoryCache cache)
{
    private readonly OpenMeteoClient _client = client;
    private readonly IMemoryCache _cache = cache;

    public async Task<List<OpenWeatherForecast>?> GetWeatherForecastAsync(
        string cityName, 
        int forecastDays, 
        int startHour, 
        int endHour )
    {
        var geoOption = new GeocodingOptions(cityName);
        var geoResult = await _client.GetLocationDataAsync(geoOption);

        if (geoResult?.Locations == null || geoResult.Locations.Length == 0)
            return null;
        var location = geoResult.Locations[0];

        return await GetWeatherForecastAsync(location.Latitude, location.Longitude, forecastDays, startHour, endHour);
    }

    public async Task<List<OpenWeatherForecast>?> GetWeatherForecastAsync(
        float lat, 
        float longl, 
        int forecastDays,
        int startHour, 
        int endHour)
    {
        float gridLat = (float)Math.Round(lat, 1);
        float gridLon = (float)Math.Round(longl, 2);
        
        string cacheKey = $"weather_{gridLat}_{gridLon}_days{forecastDays}";

        if (_cache.TryGetValue(cacheKey, out List<OpenWeatherForecast>? cachedForecast))
            return cachedForecast;

        var weatherOption = new WeatherForecastOptions
        {
            Latitude = lat,
            Longitude = longl,
            
            Start_date = DateOnly.FromDateTime(DateTime.UtcNow),
            End_date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(forecastDays)),
            
            Hourly =
            [
                HourlyOptionsParameter.temperature_2m,
                HourlyOptionsParameter.relativehumidity_2m,
                HourlyOptionsParameter.apparent_temperature,
                HourlyOptionsParameter.windspeed_10m,
                HourlyOptionsParameter.precipitation_probability,
                HourlyOptionsParameter.weathercode
            ]
                
        };

        var response = await _client.QueryWeatherApiAsync(weatherOption);
        
        if (response?.Hourly?.Time == null)
            return null;
            
        var validator = new OpenWeatherForecastResponse(response);

        if (!validator.IsValidForecast())
            return null;
        
        var forecast = new List<OpenWeatherForecast>();

        for (int i = 0; i < response.Hourly.Time.Length; i++)
        {
            DateTime apiTime = response.Hourly.Time[i].DateTime; 
            
            if (apiTime.Hour >= startHour && apiTime.Hour <= endHour)
            {
                forecast.Add(validator.ToWeatherForecast(apiTime,i));
            }
        }

        if (forecast.Count != 0)
            _cache.Set(cacheKey, forecast, TimeSpan.FromHours(1));

        return forecast;
    }
}