import { CalendarBlankIcon, CaretRightIcon } from '@phosphor-icons/react';
import { WeatherIcon } from './WeatherIcon';
import type { OpenWeatherForecast } from '../../../utils/openweather';
import { Card } from '../../../components/Card';
import { useTranslation } from 'react-i18next';

interface ForecastGridProps {
    forecasts: OpenWeatherForecast[];
}

export const ForecastGrid = ({ forecasts }: ForecastGridProps) => {
    const { t } = useTranslation();

    return (
        <Card variant="glass" className="md:col-span-3 lg:col-span-4 p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white">{t('weatherForecast')}</h3>
                <div className="text-sm text-brand-muted flex items-center gap-1">
                    {t('weather_page.next_48h')} <CalendarBlankIcon />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {forecasts.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex flex-col items-center justify-center w-12 text-center">
                            <span className="text-xs font-bold text-brand-muted uppercase">
                                {new Date(item.forecastDatetime).toLocaleString('hu-HU', {
                                    weekday: 'short'
                                })}
                            </span>
                            <span className="text-sm font-bold text-white">
                                {new Date(item.forecastDatetime).toLocaleString('hu-HU', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        <div className="p-2 bg-brand-dark/50 rounded-xl">
                            <WeatherIcon code={item.weatherCode} size={24} />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-bold text-white">{Math.round(item.temperatureC)}°</span>
                                <span className="text-xs text-brand-muted mb-1 font-medium">{item.pop}% rain</span>
                            </div>
                        </div>

                        <CaretRightIcon
                            size={16}
                            className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0"
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
};
