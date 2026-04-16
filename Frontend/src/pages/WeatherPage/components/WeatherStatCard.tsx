import type { ReactNode } from 'react';
import { Card } from '../../../components/Card';

interface WeatherStatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    subtext?: string;
    progress?: number;
    progressColor?: string;
    dataTestForValue: string;
}

export const WeatherStatCard = ({
    icon,
    label,
    value,
    unit,
    subtext,
    progress,
    progressColor = 'bg-blue-500',
    dataTestForValue
}: WeatherStatCardProps) => {
    return (
        <Card variant="glass" hoverEffect className="flex flex-col justify-between p-6">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-white/5 rounded-lg text-brand-muted [&>svg]:text-inherit">{icon}</div>
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">{label}</span>
            </div>
            <div>
                <div data-testid={dataTestForValue} className="text-4xl font-display font-bold text-white mb-1">
                    {value}
                    {unit && <span className="text-2xl ml-1">{unit}</span>}
                </div>
                {subtext && <div className="text-sm text-brand-muted">{subtext}</div>}

                {progress !== undefined && (
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>
        </Card>
    );
};
