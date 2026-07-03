import { MapTrifoldIcon, PlusIcon, ShareNetwork } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { AchievementsWidget } from './components/AchievementsWidget';
import { type ChecklistItem, ExpeditionChecklist } from './components/ExpeditionChecklist';
import { PhotoGrid } from './components/PhotoGrid';
import { ProfileHeader } from './components/ProfileHeader';
import { type UpcomingHike, UpcomingHikeCard } from './components/UpcomingHikeCard';
import { Button } from '../../components/Button';
import { getPlannedHikes } from '../../api/plannedHikeService';

function JournalPage() {
    const { t } = useTranslation();

    const [upcomingHikes, setUpcomingHikes] = useState<UpcomingHike[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        const loadHikes = async () => {
            try {
                const data = await getPlannedHikes();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedHikes: UpcomingHike[] = data.map((hike: any) => {
                    const startDate = new Date(hike.plannedStartDateTime);
                    const today = new Date();
                    const daysLeft = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

                    return {
                        id: hike.id,
                        title: hike.hikingTrail?.name || `Túra #${hike.hikingTrailId}`,
                        date: startDate.toLocaleDateString(),
                        daysLeft: daysLeft > 0 ? daysLeft : 0,
                        difficulty: hike.hikingTrail?.difficulty || 'Moderate',
                        image: hike.hikingTrail?.coverPhotoPath || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'
                    };
                });

                setUpcomingHikes(formattedHikes);
            } catch (error) {
                console.error('Error loading tours:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHikes();
    }, []);

    const handleShareHike = (hikeId: number) => {
        const joinLink = `${window.location.origin}/join-hike/${hikeId}`;

        navigator.clipboard.writeText(joinLink)
            .then(() => alert('The connection link has been copied to your clipboard! Send it to your friends.'))
            .catch(err => console.error('Error while copying: ', err));
    };

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
                                {isLoading ? (
                                    <p className="text-white">Túrák betöltése...</p>
                                ) : upcomingHikes.length === 0 ? (
                                    <p className="text-brand-muted">Még nincsenek tervezett túráid. Készíts egyet a Route oldalon!</p>
                                ) : (
                                    upcomingHikes.map((hike) => (
                                        <div key={hike.id} className="relative group">
                                            <UpcomingHikeCard hike={hike} />

                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="flex items-center gap-2 bg-brand-dark/80 backdrop-blur"
                                                    onClick={() => handleShareHike(hike.id)}
                                                >
                                                    <ShareNetwork size={16} /> Meghirdetés
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
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
                            subtitle={upcomingHikes.length > 0 ? upcomingHikes[0].title : 'No active trail'}
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
