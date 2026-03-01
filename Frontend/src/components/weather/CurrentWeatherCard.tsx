import { CalendarBlankIcon } from '@phosphor-icons/react';
import { WeatherIcon } from './WeatherIcon';
import { useTranslation } from 'react-i18next';
import type { OpenWeatherForecast } from '../../types/openweather';
import { Badge } from '../ui/Badge';

interface CurrentWeatherCardProps {
    current: OpenWeatherForecast;
}

export const CurrentWeatherCard = ({ current }: CurrentWeatherCardProps) => {
    const { t } = useTranslation();

    const getWeatherDescription = (code: number): string => {
        return t(`weatherCodes.${code}`, {
            defaultValue: t('weather_page.unknown_conditions')
        });
    };

    return (
        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-[#1a2e2e] to-[#0d1f1f] border border-white/10 group">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-linear-to-tr from-brand-accent/10 via-transparent to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="absolute top-8 right-8 animate-float z-0">
                <WeatherIcon
                    code={current.weatherCode}
                    size={160}
                    className="drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                />
            </div>

            <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full bg-linear-to-t from-brand-dark/80 to-transparent z-10">
                <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-8xl md:text-9xl font-display font-bold text-white tracking-tighter">
                        {Math.round(current.temperatureC)}°
                    </span>
                    <span className="text-2xl text-brand-muted font-medium">
                        {getWeatherDescription(current.weatherCode)}
                    </span>
                </div>
                <div className="flex gap-4 text-sm font-bold tracking-widest text-brand-accent uppercase">
                    <span>H: {Math.round(current.temperatureC + 3)}°</span>
                    <span>L: {Math.round(current.temperatureC - 2)}°</span>
                    <span>
                        {t('weatherFeelsLike')} {Math.round(current.feelsLikeC)}°
                    </span>
                </div>
            </div>

            <div className="absolute top-8 left-8 z-10">
                <Badge variant="neutral">
                    <CalendarBlankIcon size={14} />
                    <span>{t('weather_page.current_weather')}</span>
                </Badge>
            </div>
        </div>
    );
};
