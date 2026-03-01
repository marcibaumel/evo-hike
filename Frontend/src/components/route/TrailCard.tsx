import { ClockIcon, MapPinIcon, PersonSimpleRunIcon, TrendUpIcon, TrashIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import type { Trail } from '../../models/Trail';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface TrailCardProps {
    trail: Trail;
    onViewDetails?: (trail: Trail) => void;
    onDelete?: (trail: Trail) => void;
}

const getDifficultyLabel = (level: number) => {
    switch (level) {
    case 0:
        return 'Easy';
    case 1:
        return 'Moderate';
    case 2:
        return 'Hard';
    case 3:
        return 'Extreme';
    default:
        return 'Unknown';
    }
};

const getDifficultyVariant = (level: number) => {
    switch (level) {
    case 0:
        return 'accent';
    case 1:
        return 'neutral';
    case 2:
        return 'orange';
    case 3:
        return 'orange';
    default:
        return 'neutral';
    }
};

export const TrailCard = ({ trail, onViewDetails, onDelete }: TrailCardProps) => {
    const { t } = useTranslation();
    const hours = trail.length / 1000 / 4;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const duration = h > 0 ? `${h}h ${m}m` : `${m}m`;

    const distanceKm = (trail.length / 1000).toFixed(1);

    return (
        <Card variant="glass" hoverEffect className="flex flex-col h-full overflow-hidden p-0">
            <div className="relative h-48 overflow-hidden group">
                <img
                    src={
                        trail.coverPhotoPath ||
                        'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop'
                    }
                    alt={trail.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                    <Badge variant={getDifficultyVariant(trail.difficulty)}>
                        {getDifficultyLabel(trail.difficulty)}
                    </Badge>
                </div>
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(trail);
                        }}
                        className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm transition-colors z-10"
                        title={t('route.delete')}>
                        <TrashIcon size={16} />
                    </button>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="text-xl font-display font-bold text-white mb-1 line-clamp-1">{trail.name}</h3>
                    <div className="flex items-center gap-1.5 text-brand-muted text-sm">
                        <MapPinIcon size={16} weight="fill" className="text-brand-accent" />
                        <span className="truncate">{trail.location}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 mb-4">
                    <div className="flex flex-col items-center justify-center text-center">
                        <PersonSimpleRunIcon size={20} className="text-brand-muted mb-1" weight="duotone" />
                        <span className="text-sm font-bold text-white">{distanceKm} km</span>
                        <span className="text-[10px] text-brand-muted uppercase">{t('route.stats.dist')}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center border-l border-white/5">
                        <TrendUpIcon size={20} className="text-brand-muted mb-1" weight="duotone" />
                        <span className="text-sm font-bold text-white">{trail.elevationGain} m</span>
                        <span className="text-[10px] text-brand-muted uppercase">{t('route.stats.elev')}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center border-l border-white/5">
                        <ClockIcon size={20} className="text-brand-muted mb-1" weight="duotone" />
                        <span className="text-sm font-bold text-white">{duration}</span>
                        <span className="text-[10px] text-brand-muted uppercase">{t('route.stats.time')}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {onViewDetails ? (
                        <Button variant="outline" className="w-full" size="sm" onClick={() => onViewDetails(trail)}>
                            {t('route.view_details')}
                        </Button>
                    ) : (
                        <Link to={`/routeplan/${trail.id}`} className="block">
                            <Button variant="outline" className="w-full" size="sm">
                                {t('route.view_details')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </Card>
    );
};
