import {
    CloudRainIcon,
    SunIcon,
    CloudIcon,
    CloudFogIcon,
    CloudSnowIcon,
    CloudLightningIcon
} from '@phosphor-icons/react';

interface WeatherIconProps {
    code: number;
    size?: number;
    className?: string;
}

export const WeatherIcon = ({ code, size = 24, className = '' }: WeatherIconProps) => {
    const props = { size, weight: 'duotone' as const, className };
    if (code === 0) return <SunIcon {...props} className={`text-amber-400 ${className}`} />;
    if (code >= 1 && code <= 3) return <CloudIcon {...props} className={`text-gray-300 ${className}`} />;
    if (code >= 45 && code <= 48) return <CloudFogIcon {...props} className={`text-slate-400 ${className}`} />;
    if (code >= 51 && code <= 67) return <CloudRainIcon {...props} className={`text-blue-400 ${className}`} />;
    if (code >= 71 && code <= 77) return <CloudSnowIcon {...props} className={`text-cyan-100 ${className}`} />;
    if (code >= 80 && code <= 82) return <CloudRainIcon {...props} className={`text-indigo-400 ${className}`} />;
    if (code >= 95) return <CloudLightningIcon {...props} className={`text-purple-400 ${className}`} />;
    return <CloudIcon {...props} />;
};
