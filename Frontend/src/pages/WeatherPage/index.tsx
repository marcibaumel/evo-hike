import { useOpenWeather } from '../../hooks/useOpenWeather';
import { useTranslation } from 'react-i18next';
import {
    CloudLightningIcon,
    WindIcon,
    DropIcon,
    ArrowsClockwiseIcon,
    MapPinIcon,
    CloudRainIcon
} from '@phosphor-icons/react';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherStatCard } from './components/WeatherStatCard';
import { ForecastGrid } from './components/ForecastGrid';
import { Skeleton } from '../../components/Skeleton';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const WeatherSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <Skeleton className="md:col-span-2 md:row-span-2 h-100 rounded-[2.5rem]" />
        <Skeleton className="h-47.5 rounded-3xl" />
        <Skeleton className="h-47.5 rounded-3xl" />
        <Skeleton className="md:col-span-2 h-47.5 rounded-3xl" />
    </div>
);

//TODO: SEPARATE COMPONENTS FOR CURRENT WEATHER, WEATHER STATS, AND FORECAST GRID FOR BETTER MAINTAINABILITY
function Weather() {
    const { data: forecasts, loading, error, refetch } = useOpenWeather();
    const { t } = useTranslation();

    const current = forecasts?.[0];
    const upcoming = forecasts?.slice(1);

    if (loading)
        return (
            <div className="min-h-screen bg-brand-dark pt-32 px-6">
                <div className="max-w-7xl mx-auto mb-8">
                    <Skeleton className="h-8 w-48 rounded-xl mb-2" />
                    <Skeleton className="h-4 w-32 rounded-xl" />
                </div>
                <WeatherSkeleton />
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6 pt-24">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md backdrop-blur-md">
                    <CloudLightningIcon size={48} className="mx-auto text-red-400 mb-4" />
                    <h2 data-testid="weather-page-network-error" className="text-xl font-bold text-white mb-2">{t('weather_page.error.failed')}</h2>
                    <p className="text-red-200/60 mb-6">{error}</p>
                    <Button
                        onClick={refetch}
                        variant="secondary"
                        className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-white">
                        {t('weather_page.error.retry')}
                    </Button>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-brand-dark pt-28 pb-12 px-6 overflow-x-hidden selection:bg-brand-accent selection:text-brand-dark">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-brand-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 bg-blue-600/5 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                            {t('weatherForecast')}
                        </h1>
                        <div className="flex items-center gap-2 text-brand-muted font-medium">
                            <MapPinIcon weight="fill" className="text-brand-accent" />
                            <span>Bükk Region, Hungary</span>
                        </div>
                    </div>
                    <button
                        onClick={refetch}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all group"
                        title={t('refresh')}>
                        <ArrowsClockwiseIcon
                            size={20}
                            className="text-white group-hover:rotate-180 transition-transform duration-500"
                        />
                    </button>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
                    {/* 1. HERO: Current Weather */}
                    {current && <CurrentWeatherCard current={current} />}

                    {/* 2. STAT: Wind */}
                    {current && (
                        <WeatherStatCard
                            icon={<WindIcon size={24} weight="duotone" />}
                            label={t('weatherWind')}
                            value={current.windSpeed_ms.toPrecision(3)}
                            subtext={t('weather_page.units.meters_per_sec')}
                            dataTestForValue='weather-stat-wind-value'
                        />
                    )}

                    {/* 3. STAT: Humidity */}
                    {current && (
                        <WeatherStatCard
                            icon={<DropIcon size={24} weight="duotone" className="text-blue-400" />}
                            label={t('weather_page.labels.humidity')}
                            value={current.humidityPercent}
                            unit={t('weather_page.units.percent')}
                            subtext={t('weather_page.labels.humidity')}
                            progress={current.humidityPercent}
                            dataTestForValue='weather-stat-humidity-value'
                        />
                    )}

                    {/* 4. STAT: Rain Chance */}
                    {current && (
                        <Card
                            variant="glass"
                            className="md:col-span-2 flex flex-row items-center justify-between hover:bg-brand-card transition-colors duration-300">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">
                                    <CloudRainIcon size={16} />
                                    <span>{t('weather_page.labels.precip_chance')}</span>
                                </div>
                                <div className="text-3xl font-display font-bold text-white">
                                    {current.pop}%{' '}
                                    <span className="text-lg font-normal text-brand-muted">
                                        {t('weather_page.labels.probability')}
                                    </span>
                                </div>
                            </div>
                            <div className="w-1/3 text-right">
                                {current.pop > 50 ? (
                                    <span className="text-blue-400 font-bold">
                                        {t('weather_page.status.expect_rain')}
                                    </span>
                                ) : (
                                    <span className="text-brand-accent font-bold">
                                        {t('weather_page.status.likely_dry')}
                                    </span>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* 5. LIST: Upcoming Forecast */}
                    {upcoming && <ForecastGrid forecasts={upcoming} />}
                </div>
            </div>
        </div>
    );
}

export default Weather;
