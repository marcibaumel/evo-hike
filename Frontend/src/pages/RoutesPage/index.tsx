/* eslint-disable no-console */
import { useState, useEffect, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import { useTranslation } from 'react-i18next';
import { TrailCard } from './components/TrailCard';
import { RouteMap } from './components/RouteMap';
import backendTrails from '../../assets/mockData/backendTrails.json';
import type { DifficultyLevel } from '../../utils/difficulty';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import RouteEditorPanel from './components/RouteEditorPanel';
import { Trail } from '../../utils/Trail';
import { planNewHike } from '../../api/plannedHikeService';

const emptyGeoJson: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TrailData = any;

//TODO: SEPARATE COMPONENTS FOR TRAIL LIST, TRAIL CARD, AND MAP FOR BETTER MAINTAINABILITY
function RoutePage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedGeoJson, setDisplayedGeoJson] = useState<FeatureCollection>(emptyGeoJson);
    const [isCreatingRoute, setIsCreatingRoute] = useState(false);
    const [newRouteName, setNewRouteName] = useState('');
    const [newRouteDescription, setNewRouteDescription] = useState('');
    const [newRouteDistance, setNewRouteDistance] = useState(0);
    const [newRouteTime, setNewRouteTime] = useState(0);
    const [currentRouteCoordinates, setCurrentRouteCoordinates] = useState<[number, number][]>([]);
    const [userTrails, setUserTrails] = useState<TrailData[]>([]);

    const [planningTrail, setPlanningTrail] = useState<Trail | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTrailsFromDb = async () => {
            try {
                const token = localStorage.getItem('token') || '';
                const response = await fetch('/api/Trails', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const dbTrails = await response.json();

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formattedTrails = dbTrails.map((t: any) => ({
                        id: t.id,
                        name: t.trailName || t.name || t('routePage.unnamed_route'),
                        location: t.location || t('routePage.custom_route'),
                        length: t.length,
                        difficulty: t.difficulty === 0 ? 'Easy' : t.difficulty === 2 ? 'Hard' : 'Moderate',
                        elevationGain: t.elevationGain || t.elevation || 0,
                        coverPhotoPath: t.coverPhotoPath || ''
                    }));

                    setUserTrails(formattedTrails);
                }
            } catch (e) {
                console.error('Failed to load tours from database', e);
            }
        };

        fetchTrailsFromDb();
    }, [t]);

    const allTrailsData = useMemo(() => {
        return [...userTrails, ...backendTrails];
    }, [userTrails]);

    const allTrails = useMemo(() => {
        return allTrailsData.map((t) => {
            let difficulty: DifficultyLevel = 1;
            if (t.difficulty === 'Easy') difficulty = 0;
            else if (t.difficulty === 'Moderate') difficulty = 1;
            else if (t.difficulty === 'Hard') difficulty = 2;
            else if (t.difficulty === 'Extreme') difficulty = 3;

            return new Trail({
                ...t,
                difficulty: difficulty
            });
        });
    }, [allTrailsData]);

    const filteredTrails = allTrails.filter((trail) => trail.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleViewDetails = (trail: Trail) => {
        const originalData = allTrailsData.find((t: TrailData) => t.id === trail.id);

        if (originalData && originalData.geojson) {
            const feature = originalData.geojson;
            const collection: FeatureCollection = {
                type: 'FeatureCollection',
                features: [feature]
            };
            setDisplayedGeoJson(collection);
        }
    };

    const handleSaveNewRoute = async () => {
        if (!newRouteName) {
            alert(t('routePage.enter_route_name'));
            return;
        }

        const newTrailData = {
            name: newRouteName,
            location: t('routePage.custom_route'),
            length: newRouteDistance,
            difficulty: newRouteDistance < 5000 ? 0 : newRouteDistance > 15000 ? 2 : 1,
            elevationGain: 0,
            rating: 0,
            reviewCount: 0,
            coverPhotoPath: ''
        };

        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch('/api/Trails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTrailData)
            });

            if (!response.ok) {
                throw new Error('Server error when saving the tour.');
            }

            const savedTrail = await response.json();

            const newTrailObj = {
                id: savedTrail.id,
                name: savedTrail.trailName || savedTrail.name || newRouteName,
                location: savedTrail.location || t('routePage.custom_route'),
                length: savedTrail.length || newRouteDistance,
                difficulty: savedTrail.difficulty === 0 ? 'Easy' : savedTrail.difficulty === 2 ? 'Hard' : 'Moderate',
                elevationGain: savedTrail.elevationGain || 0,
                coverPhotoPath: savedTrail.coverPhotoPath || '',
                geojson: {
                    type: 'Feature',
                    properties: { id: savedTrail.id, name: newRouteName },
                    geometry: { type: 'LineString', coordinates: currentRouteCoordinates }
                }
            };

            const updatedUserTrails = [newTrailObj, ...userTrails];
            setUserTrails(updatedUserTrails);
            localStorage.setItem('userTrails', JSON.stringify(updatedUserTrails));

            setIsCreatingRoute(false);
            setNewRouteName('');
            setNewRouteDescription('');
            setNewRouteDistance(0);
            setNewRouteTime(0);
            setCurrentRouteCoordinates([]);

            alert(t('routePage.route_saved_success'));

        } catch (error) {
            console.error(error);
            alert(t('routePage.route_save_error'));
        }
    };

    const handleDeleteTrail = async (trail: Trail) => {
        if (confirm(t('route.confirm_delete', 'Are you sure you want to delete this trail?'))) {
            try {
                const numericId = parseInt(trail.id.toString());

                if (!isNaN(numericId) && numericId > 0) {
                    const token = localStorage.getItem('token') || '';
                    const response = await fetch(`/api/Trails/${numericId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Server error while deleting.');
                    }
                }

                const updatedUserTrails = userTrails.filter((t) => t.id !== trail.id);
                setUserTrails(updatedUserTrails);
                localStorage.setItem('userTrails', JSON.stringify(updatedUserTrails));

                setDisplayedGeoJson(emptyGeoJson);

            } catch (error) {
                console.error('Error while deleting:', error);
                alert(t('routePage.route_save_error'));
            }
        }
    };

    const handleRouteCalculated = (distance: number, time: number, coordinates: [number, number][] = []) => {
        setNewRouteDistance(distance);
        setNewRouteTime(time);
        setCurrentRouteCoordinates(coordinates);
    };

    const handleGpxLoaded = (data: FeatureCollection | null) => {
        if (data) {
            setDisplayedGeoJson(data);
            setNewRouteDistance(5000);
            setNewRouteTime(3600);
        }
    };

    const handleOpenPlanner = (trail: Trail) => {
        setPlanningTrail(trail);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);

        const tomorrowEnd = new Date(tomorrow);
        tomorrowEnd.setHours(18, 0, 0, 0);

        setStartDate(tomorrow.toISOString().slice(0, 16));
        setEndDate(tomorrowEnd.toISOString().slice(0, 16));
    };

    const handleSavePlannedHike = async () => {
        if (!planningTrail || !startDate || !endDate) return;

        const numericId = parseInt(planningTrail.id.toString());

        if (isNaN(numericId) || numericId <= 0) {
            alert(t('routePage.test_data_error'));
            return;
        }

        try {
            setIsSubmitting(true);
            await planNewHike({
                routeId: numericId,
                start: new Date(startDate).toISOString(),
                end: new Date(endDate).toISOString()
            });
            alert(t('routePage.schedule_success'));
            setPlanningTrail(null);
        } catch (error) {
            console.error('Error:', error);
            alert(t('routePage.schedule_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen pt-20 lg:overflow-hidden bg-brand-dark">
            {/* Sidebar - Trail List or Editor */}
            <div className="w-full lg:w-1/3 flex flex-col border-r border-white/10 bg-brand-dark z-10 relative">
                {isCreatingRoute ? (
                    <RouteEditorPanel
                        name={newRouteName}
                        description={newRouteDescription}
                        distance={newRouteDistance}
                        time={newRouteTime}
                        onNameChange={setNewRouteName}
                        onDescriptionChange={setNewRouteDescription}
                        onSave={handleSaveNewRoute}
                        closeRouteEditor={() => setIsCreatingRoute(false)}
                        onGpxLoaded={handleGpxLoaded}
                    />
                ) : (
                    <>
                        {/* Header & Filter */}
                        <div className="p-6 border-b border-white/5 bg-brand-dark/95 backdrop-blur-md sticky top-0 z-20">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <MagnifyingGlassIcon
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder={t('route.search_placeholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50 transition-colors"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    className="p-2.5 rounded-xl h-auto bg-brand-accent hover:bg-brand-accent/90"
                                    size="sm"
                                    onClick={() => setIsCreatingRoute(true)}
                                    title={t('routeForm.add_route')}>
                                    <PlusIcon size={20} weight="bold" className="text-brand-dark" />
                                </Button>
                            </div>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 lg:overflow-y-auto p-4 space-y-4">
                            {filteredTrails.map((trail) => (
                                <div key={trail.id} className="hover:scale-[1.01] transition-transform duration-300">
                                    <TrailCard
                                        trail={trail}
                                        onViewDetails={handleViewDetails}
                                        onDelete={() => handleDeleteTrail(trail)}
                                        onPlanHike={() => handleOpenPlanner(trail)}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Map Area */}
            <RouteMap geojson={displayedGeoJson} onRouteCalculated={handleRouteCalculated} />

            {/* Date Select */}
            {planningTrail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-brand-dark border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-6">
                        <h3 className="text-xl font-bold text-white">
                            {t('plan.title')}: {planningTrail.name}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-brand-muted text-sm mb-1">{t('plan.start_date')}</label>
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-brand-muted text-sm mb-1">{t('plan.end_date')}</label>
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="secondary" onClick={() => setPlanningTrail(null)} disabled={isSubmitting}>
                                {t('plan.cancel')}
                            </Button>
                            <Button variant="primary" className="bg-brand-accent text-brand-dark" onClick={handleSavePlannedHike} disabled={isSubmitting}>
                                {isSubmitting ? t('plan.saving') : t('plan.save')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default RoutePage;
