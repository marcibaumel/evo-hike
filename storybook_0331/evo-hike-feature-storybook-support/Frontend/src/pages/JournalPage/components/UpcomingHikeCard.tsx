import { CalendarCheckIcon, TrendUpIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

export interface UpcomingHike {
    id: number;
    title: string;
    date: string;
    daysLeft: number;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    image: string;
}

interface UpcomingHikeCardProps {
    hike: UpcomingHike;
}

//TODO: SEPARATE COMPONENTS FOR IMAGE, OVERLAY, AND INFO FOR BETTER MAINTAINABILITY
export const UpcomingHikeCard = ({ hike }: UpcomingHikeCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer">
            <img
                src={hike.image}
                alt={hike.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                <div>
                    <div className="inline-block px-3 py-1 mb-2 rounded-full bg-brand-accent/20 backdrop-blur-md text-brand-accent text-xs font-bold uppercase">
                        {t('dashboard.upcoming.days_left', { count: hike.daysLeft })}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white">{hike.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                        <CalendarCheckIcon size={16} /> {hike.date}
                        <span className="w-1 h-1 bg-gray-500 rounded-full" />
                        <span className={hike.difficulty === 'Hard' ? 'text-red-400' : 'text-yellow-400'}>
                            {hike.difficulty}
                        </span>
                    </div>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-brand-accent group-hover:text-brand-dark transition-colors">
                    <TrendUpIcon size={24} weight="bold" />
                </div>
            </div>
        </div>
    );
};
