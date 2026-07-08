/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react';
import type { OpenWeatherForecast } from '../utils/openweather';
import axios from 'axios';

export function useOpenWeather(city: string = 'Miskolc') {
    const [data, setData] = useState<OpenWeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: {
                    name: city,
                    count: 1,
                    language: 'en',
                    format: 'json'
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                const location = response.data.results[0];

                const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
                    params: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
                        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                        hourly: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability',
                        timezone: 'auto'
                    }
                });

                const current = weatherResponse.data.current;
                const daily = weatherResponse.data.daily;
                const hourly = weatherResponse.data.hourly;

                const currentForecast: OpenWeatherForecast = {
                    forecastDatetime: current.time,
                    weatherCode: current.weather_code,
                    temperatureC: current.temperature_2m,
                    feelsLikeC: current.apparent_temperature,
                    windSpeed_ms: current.wind_speed_10m / 3.6,
                    humidityPercent: current.relative_humidity_2m,
                    pop: daily.precipitation_probability_max[0] || 0,
                    tempMaxC: daily.temperature_2m_max[0],
                    tempMinC: daily.temperature_2m_min[0]
                };

                const forecasts: OpenWeatherForecast[] = [currentForecast];

                const now = new Date();
                const futureIndices = hourly.time
                    .map((timeStr: string, index: number) => ({ time: new Date(timeStr), index }))
                    .filter((item: { time: Date, index: number }) => item.time > now);

                const sampledIndices = futureIndices.filter((_: any, idx: number) => idx % 3 === 0).slice(0, 16);

                for (const { index } of sampledIndices) {
                    forecasts.push({
                        forecastDatetime: hourly.time[index],
                        weatherCode: hourly.weather_code[index],
                        temperatureC: Math.round(hourly.temperature_2m[index]),
                        feelsLikeC: Math.round(hourly.apparent_temperature[index]),
                        windSpeed_ms: hourly.wind_speed_10m[index] / 3.6,
                        humidityPercent: 0,
                        pop: hourly.precipitation_probability[index] || 0
                    });
                }

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