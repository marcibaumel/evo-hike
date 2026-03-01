/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react';
import type { OpenWeatherForecast } from '../types/openweather';
import apiClient from '../api/axios';

export function useOpenWeather(city: string = 'Miskolc') {
    const [data, setData] = useState<OpenWeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get<OpenWeatherForecast[]>('/api/OpenWeatherForecast/city', {
                params: { city }
            });
            setData(response.data);
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
