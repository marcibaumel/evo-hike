export const mockGeocodingResponse = {
    results: [
        {
            id: 716369,
            name: 'Miskolc',
            latitude: 48.1035,
            longitude: 20.7774,
            elevation: 195,
            feature_code: 'PPLA',
            country_code: 'HU',
            timezone: 'Europe/Budapest',
            population: 157995
        }
    ]
};

export const mockWeatherResponse = {
    latitude: 48.1035,
    longitude: 20.7774,
    generationtime_ms: 0.45,
    utc_offset_seconds: 7200,
    timezone: 'Europe/Budapest',
    timezone_abbreviation: 'CEST',
    elevation: 195,
    daily_units: {
        time: 'iso8601',
        weather_code: 'wmo code',
        temperature_2m_max: '°C',
        temperature_2m_min: '°C',
        precipitation_sum: 'mm',
        wind_speed_10m_max: 'km/h'
    },
    daily: {
        time: [
            '2026-04-16',
            '2026-04-17',
            '2026-04-18',
            '2026-04-19',
            '2026-04-20',
            '2026-04-21',
            '2026-04-22'
        ],
        weather_code: [2, 3, 45, 80, 0, 1, 2],
        temperature_2m_max: [18, 16, 14, 15, 19, 20, 17],
        temperature_2m_min: [10, 9, 8, 7, 11, 12, 10],
        precipitation_sum: [0, 0, 2, 5, 0, 0, 1],
        wind_speed_10m_max: [12, 15, 20, 18, 10, 8, 12]
    }
};