/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react';
import type { OpenWeatherForecast } from '../utils/openweather';
import apiClient from '../api/Client';

export function useOpenWeather(city: string = 'Miskolc') {
    const [data, setData] = useState<OpenWeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: {
                    name: city,
                    count: 1,
                    language: 'en',
                    format: 'json'
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                const location = response.data.results[0];
                const weatherResponse = await apiClient.get('https://api.open-meteo.com/v1/forecast', {
                    params: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
                        timezone: 'auto'
                    }
                });

                // Transform Open-Meteo daily forecast to OpenWeatherForecast format
                const daily = weatherResponse.data.daily;
                const forecasts = daily.time.map((time: string, index: number) => ({
                    forecastDatetime: time,
                    weatherCode: daily.weather_code[index],
                    temperatureC: Math.round((daily.temperature_2m_max[index] + daily.temperature_2m_min[index]) / 2),
                    feelsLikeC: Math.round((daily.temperature_2m_max[index] + daily.temperature_2m_min[index]) / 2),
                    windSpeed_ms: (daily.wind_speed_10m_max[index] / 3.6) || 0, // Convert km/h to m/s
                    humidityPercent: 0, // Open-Meteo doesn't provide daily humidity
                    pop: daily.precipitation_sum[index] > 0 ? 100 : 0 // Precipitation probability
                }));

                setData(forecasts);
            } else {
                throw new Error('City not found');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [city]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return { data, loading, error, refetch: fetchWeather };
}
