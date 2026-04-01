import { MapTrifoldIcon, PlusIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AchievementsWidget } from './components/AchievementsWidget';
import { type ChecklistItem, ExpeditionChecklist } from './components/ExpeditionChecklist';
import { PhotoGrid } from './components/PhotoGrid';
import { ProfileHeader } from './components/ProfileHeader';
import { type UpcomingHike, UpcomingHikeCard } from './components/UpcomingHikeCard';

function JournalPage() {
    const { t } = useTranslation();

    const user = {
        name: 'Alex Wanderer',
        level: 'Pathfinder Lvl. 12',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
        stats: {
            totalDistance: '1,248 km',
            elevationGain: '8,848 m',
            hikesCompleted: 42
        }
    };

    const upcomingHikes: UpcomingHike[] = [
        {
            id: 1,
            title: 'Bükk Peaks Challenge',
            date: 'Oct 12, 2024',
            daysLeft: 3,
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'Lillafüred Waterfall Loop',
            date: 'Oct 20, 2024',
            daysLeft: 11,
            difficulty: 'Moderate',
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2070&auto=format&fit=crop'
        }
    ];

    const recentPhotos = [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502085671122-2d218cd434e6?q=80&w=1226&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2548&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop'
    ];

    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
        {
            id: '1',
            text: t('dashboard.checklist.items.offline_maps'),
            isCompleted: false
        },
        {
            id: '2',
            text: t('dashboard.checklist.items.weather_check'),
            isCompleted: false
        },
        {
            id: '3',
            text: t('dashboard.checklist.items.first_aid'),
            isCompleted: false
        },
        {
            id: '4',
            text: t('dashboard.checklist.items.power_bank'),
            isCompleted: false
        },
        { id: '5', text: t('dashboard.checklist.items.boots'), isCompleted: false }
    ]);

    return (
        <div className="min-h-screen bg-brand-dark pt-28 pb-12 px-4 selection:bg-brand-accent selection:text-brand-dark">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Profile Header */}
                <ProfileHeader user={user} />

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Upcoming Adventures */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                                    <MapTrifoldIcon className="text-brand-accent" /> {t('dashboard.upcoming.title')}
                                </h2>
                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                                    <PlusIcon size={20} className="text-white" />
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {upcomingHikes.map((hike) => (
                                    <UpcomingHikeCard key={hike.id} hike={hike} />
                                ))}
                            </div>
                        </section>

                        {/* Recent Memories (Gallery) */}
                        <PhotoGrid photos={recentPhotos} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Checklist */}
                        <ExpeditionChecklist
                            title={t('dashboard.checklist.title')}
                            subtitle="Bükk Peaks Challenge"
                            items={checklistItems}
                            onUpdate={setChecklistItems}
                        />

                        {/* Achievements Mini */}
                        <AchievementsWidget />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JournalPage;
