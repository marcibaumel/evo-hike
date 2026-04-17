import { MapPinIcon } from '@phosphor-icons/react';
import type { SocialStats } from './SocialPost';

interface SocialPostStatsProps {
    location: string;
    stats: SocialStats;
}

export const SocialPostStats = ({ location, stats }: SocialPostStatsProps) => {
    return (
        <div className="px-6 py-4 bg-black/20 border-b border-white/5 flex justify-between items-center text-xs md:text-sm">
            <div className="flex items-center gap-2 text-brand-muted">
                <MapPinIcon weight="fill" className="text-brand-accent" />
                {location}
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-1 text-brand-text font-medium">
                    <span className="text-brand-muted">Dist:</span> {stats.distance}
                </div>
                <div className="flex items-center gap-1 text-brand-text font-medium">
                    <span className="text-brand-muted">Elev:</span> {stats.elevation}
                </div>
            </div>
        </div>
    );
};