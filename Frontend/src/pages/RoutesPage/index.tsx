/* eslint-disable no-console */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Map } from 'leaflet';
import type { FeatureCollection, Feature } from 'geojson';
import { RouteMap } from './components/RouteMap';
import {FilterPanel} from './components/FilterPanel';
import { Button } from '../../components/Button';
import { TrailCard } from './components/TrailCard';
import RouteEditorPanel from './components/RouteEditorPanel';
import SelectedTrailDetails from './components/SelectedTrailDetails';
//import backendTrails from '../../assets/mockData/backendTrails.json';
import type { DifficultyLevel } from '../../utils/difficulty';
import { MagnifyingGlassIcon, PlusIcon,SlidersHorizontalIcon } from '@phosphor-icons/react';

import { Trail } from '../../utils/Trail';
import { useTrailFilters } from '../../hooks/useTrailFilters';
import { getNearbyPOIs, type OverpassElement } from '../../api/overpassApi';

import { trailService } from '../../api/trailService';

import './routespage.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TrailData = any;
type ViewState = 'list' | 'create' | 'filter';

export default function RoutePage() {
    const { t } = useTranslation();
    const [trails, setTrails] = useState<Trail[]>([]);
  //  const [userTrails, setUserTrails] = useState<TrailData[]>([]);
    const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
    const [pois, setPois] = useState<OverpassElement[]>([]);
    const [mapInstance, setMapInstance] = useState<Map | null>(null);
    const [view, setView] = useState<ViewState>('list');

  //  const [serverTrails, setServerTrails] = useState<TrailData[]>([]);

    const [customRoute, setCustomRoute] = useState({
        name: '',
        description: '',
        distance: 0,
        time: 0,
        coordinates: [] as [number, number][]
    });
    const [uploadedGpx, setUploadedGpx] = useState<FeatureCollection | null>(null);
    const [routeImages, setRouteImages] = useState<File[]>([]);
    const [points, setPoints] = useState<{
    start: [number, number] | null;
    end: [number, number] | null;
    mids: [number, number][];
  }>({ start: null, end: null, mids: [] });

    useEffect(() => {
        const saved = localStorage.getItem('userTrails');
        if (saved) {
            try {
                const parsedTrails = JSON.parse(saved) as ConstructorParameters<typeof Trail>[0][];
                setUserTrails(parsedTrails);
            } catch (e) {
                console.error('Failed to parse user trails', e);
            }
        }
    }, []);

    useEffect(() => {
        const cachedServerTrails = localStorage.getItem('serverTrails');
        if (cachedServerTrails) {
            try {
                setServerTrails(JSON.parse(cachedServerTrails));
            } catch (e) {
                console.error('Hiba a szerver cache olvasásakor', e);
            }
        }

        const fetchTrails = async () => {
            try {
                const data = await trailService.getTrails();
                setServerTrails(data);
                localStorage.setItem('serverTrails', JSON.stringify(data));
            } catch (error) {
                console.error('Nem sikerült letölteni a túrákat a backendről:', error);
            }
        };

        fetchTrails();
    }, []);

    const allTrails = useMemo(() => {
        const combined = [...serverTrails, ...userTrails] as Record<string, unknown>[];

        const uniqueCombined = Array.from(new globalThis.Map(combined.map(item => [String(item.id), item])).values());

        return uniqueCombined.map(t => {
            let diffLevel: DifficultyLevel = 0;
            if (typeof t.difficulty === 'string') {
                diffLevel = (t.difficulty === 'Easy' ? 0 : t.difficulty === 'Moderate' ? 1 : t.difficulty === 'Hard' ? 2 : 3) as DifficultyLevel;
            } else if (typeof t.difficulty === 'number') {
                diffLevel = t.difficulty as DifficultyLevel;
            }

            return new Trail({
                id: String(t.id),
                name: String(t.name || ''),
                location: String(t.location || ''),
                length: Number(t.length) || 0,
                elevationGain: Number(t.elevationGain) || 0,
                time: Number(t.estimatedDuration || t.time) || 0,
                rating: Number(t.rating) || 0,
                reviewCount: Number(t.reviewCount) || 0,
                coverPhotoPath: String(t.coverPhotoPath || ''),
                description: String(t.description || ''),
                userPhotos: (t.userPhotos as string[]) || [],
                geojson: (t.geojson || t.routeLine) as FeatureCollection | Feature | null | undefined,
                difficulty: diffLevel,
                startPoint: t.startPoint as { lat: number, lng: number } | null,
                endPoint: t.endPoint as { lat: number, lng: number } | null,
                waypoints: (t.waypoints as { lat: number, lng: number }[]) || []
            });
        });
    }, [userTrails, serverTrails]);

    const { filteredTrails, filters, setFilters } = useTrailFilters(allTrails);

    const fetchPOIs = useCallback(async (coordinates: [number, number][]) => {
        try {
            const results = await getNearbyPOIs(coordinates.map(([lon, lat]) => ({ lat, lon })), 200);
            setPois(results.filter(p => p.tags?.name));
        } catch (error) {
            console.error('Failed to fetch POIs', error);
        }
    }, []);

    const handleTrailSelect = useCallback((trailId: string) => {
        const trail = allTrails.find(t => String(t.id) === String(trailId));
        if (trail) {
            setSelectedTrail(trail);

            const geoData = trail.geojson;

            if (geoData) {
                if (geoData.type === 'Feature' && geoData.geometry?.type === 'LineString') {
                    fetchPOIs(geoData.geometry.coordinates as [number, number][]);
                } else if (geoData.type === 'FeatureCollection') {
                    const lineStringFeature = geoData.features.find(f => f.geometry?.type === 'LineString');
                    if (lineStringFeature && lineStringFeature.geometry?.type === 'LineString') {
                        fetchPOIs(lineStringFeature.geometry.coordinates as [number, number][]);
                    }
                }
            }
        }
    }, [allTrails, fetchPOIs]);

    const handleSaveNewRoute = async () => {
        if (!customRoute.name) return alert('Kérlek add meg a túra nevét!');

        if (!customRoute.coordinates || customRoute.coordinates.length < 2) {
            return alert('Kérlek rajzolj fel egy útvonalat a térképre mentés előtt!');
        }
        
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

        let base64Photos: string[] = [];
        if (routeImages && routeImages.length > 0) {
            base64Photos = await Promise.all(routeImages.map(file => toBase64(file)));
        }
        
        
        const payload = {
            name: customRoute.name,
            description: customRoute.description,
            length: customRoute.distance, 
            difficulty: customRoute.distance < 5000 ? 0 : customRoute.distance > 15000 ? 2 : 1, 
            time: Math.round(customRoute.time),
            userPhotos: base64Photos,
            startPoint: points.start ? { lat: points.start[0], lng: points.start[1] } : null,
            endPoint: points.end ? { lat: points.end[0], lng: points.end[1] } : null,
            waypoints: points.mids.map(p => ({ lat: p[0], lng: p[1] })),
            routeLine: {
                type: 'LineString' as const,
                coordinates: customRoute.coordinates
            }
        };

        try {
            const savedTrailDTO = await trailService.createTrail(payload);
            
            const newTrail: ConstructorParameters<typeof Trail>[0] = {
                id: String(savedTrailDTO.id),
                name: savedTrailDTO.name,
                location: savedTrailDTO.location || 'Custom Route',
                length: savedTrailDTO.length,
                difficulty: savedTrailDTO.difficulty as DifficultyLevel,
                elevationGain: savedTrailDTO.elevationGain || 0,
                time: savedTrailDTO.time || 0,
                rating: savedTrailDTO.rating || 0,
                reviewCount: savedTrailDTO.reviewCount || 0,
                coverPhotoPath: savedTrailDTO.coverPhotoPath || '',
                description: savedTrailDTO.description || '',
                userPhotos: savedTrailDTO.userPhotos || [],
                geojson: uploadedGpx || ({
                    type: 'Feature',
                    properties: { id: String(savedTrailDTO.id), name: savedTrailDTO.name },
                    geometry: { type: 'LineString', coordinates: customRoute.coordinates }
                } as Feature)
            };
            

            const updatedServerTrails = [newTrail, ...serverTrails];
            setServerTrails(updatedServerTrails);
            localStorage.setItem('serverTrails', JSON.stringify(updatedServerTrails));
            
            setView('list');
            handleResetForm();

        } catch (error) {
            console.error('Mentési hiba:', error);
            alert('Nem sikerült elmenteni a túrát a szerverre. Ellenőrizd a kapcsolatot!');
        }
    };

    const handleClearRoute = () => {
        setPoints({ start: null, end: null, mids: [] });
    };

    const handleResetForm = () => {
        setRouteImages([]);
        setUploadedGpx(null);
        setCustomRoute({ name: '', description: '', distance: 0, time: 0, coordinates: [] });
        setPoints({ start: null, end: null, mids: [] });
    };

    const handleDeleteTrail = async (id: string) => {
        if (!window.confirm("Biztosan törölni szeretnéd ezt a túrát?")) return;
        
        if (userTrails.some(t => String(t.id) === id)) {
            const updated = userTrails.filter(t => String(t.id) !== id);
            setUserTrails(updated);
            localStorage.setItem('userTrails', JSON.stringify(updated));
        }
        else if (serverTrails.some(t => String(t.id) === id)) {
            try {
                await trailService.deleteTrail(Number(id));
                
                const updated = serverTrails.filter(t => String(t.id) !== id);
                setServerTrails(updated);
                localStorage.setItem('serverTrails', JSON.stringify(updated));
            } catch (error) {
                console.error("Hiba a backend törlés során:", error);
                alert("Nem sikerült törölni a túrát a szerverről!");
                return; 
            }
        }
        else {
            alert("A fejlesztői ajánlásokat (beépített túrák) nem lehet törölni!");
            return;
        }
        
        if (selectedTrail?.id === id) {
            setSelectedTrail(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen pt-20 lg:overflow-hidden bg-brand-dark">
            <div className="w-full lg:w-1/3 flex flex-col border-r border-white/10 bg-brand-dark z-10 relative">
                {view === 'create' ? (
                    <RouteEditorPanel
                        name={customRoute.name}
                        description={customRoute.description}
                        distance={customRoute.distance}
                        time={customRoute.time}
                        onNameChange={(val) => setCustomRoute(p => ({ ...p, name: val }))}
                        onDescriptionChange={(val) => setCustomRoute(p => ({ ...p, description: val }))}
                        onSave={handleSaveNewRoute}
                        closeRouteEditor={() => setView('list')}
                        onGpxLoaded={(data) => setUploadedGpx(data)}
                        images={routeImages}
                        onImagesChange={setRouteImages}
                        onReset={handleResetForm}
                    />
                ) : view === 'filter' ? (
                    <FilterPanel
                        onClose={() => setView('list')}
                        onFilterChange={setFilters}
                        filters={filters}
                    />
                ) : (
                    <>
                        <div className="p-6 border-b border-white/5 bg-brand-dark/95 backdrop-blur-md sticky top-0 z-20">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                                    <input
                                        type="text"
                                        placeholder={t('route.search_placeholder')}
                                        onChange={(e) => setFilters(prev => {
                                            const nextFilter = prev.clone();
                                            nextFilter.searchText = e.target.value;
                                            return nextFilter;
                                        })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50 transition-colors"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    className="p-2.5 rounded-xl h-auto bg-brand-accent hover:bg-brand-accent/90 relative"
                                    size="sm"
                                    onClick={() => setView('filter')}
                                    title="Filter trails"
                                >
                                    <SlidersHorizontalIcon size={20} />
                                </Button>
                                <Button
                                    variant="primary"
                                    className="p-2.5 rounded-xl h-auto bg-brand-accent hover:bg-brand-accent/90"
                                    size="sm"
                                    onClick={() => setView('create')}
                                    title={t('route.create_new')}
                                    data-testid="btn-create-route"
                                >
                                    <PlusIcon size={20} className="text-brand-dark" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 lg:overflow-y-auto p-4 space-y-4">
                            {filteredTrails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                                    <MagnifyingGlassIcon size={40} className="text-brand-muted opacity-40" />
                                    <p className="text-brand-muted text-sm text-center">
                                        {t('filterPage.noMatch')}
                                    </p>
                                    <button
                                        onClick={() => setView('filter')}
                                        className="text-brand-accent text-sm underline underline-offset-2 hover:text-brand-accent/70 transition-colors"
                                    >
                                        {t('filterPage.adjustFilters')}
                                    </button>
                                </div>
                            ) : (
                                filteredTrails.map((trail) => (
                                    <div key={trail.id} className="hover:scale-[1.01] transition-transform duration-300">
                                        <TrailCard
                                            trail={trail}
                                            onViewDetails={() => handleTrailSelect(trail.id)}
                                            onDelete={
                                                backendTrails.some(t => String(t.id) === trail.id) ? undefined : () => handleDeleteTrail(trail.id)
                                            }
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="relative flex-1 h-full">
                <RouteMap
                    selectedTrailId={selectedTrail?.id}
                    selectedTrail={selectedTrail}
                    customGeojson={uploadedGpx}
                    selectedGeojson={selectedTrail?.geojson}
                    pois={pois}
                    onRouteCalculated={(d, t, c) => setCustomRoute(p => ({ ...p, distance: d, time: t, coordinates: c }))}
                    onMapReady={setMapInstance}
                    onTrailClick={handleTrailSelect}
                    onClear={handleClearRoute}
                    creatingRouteState={view === 'create'}
                    points={points}
                    setPoints={setPoints}
                />
                {selectedTrail && mapInstance && (
                    <div className="absolute bottom-6 right-6 left-6 lg:left-auto lg:w-96 z-[1000] animate-fadeIn">
                        <SelectedTrailDetails trail={selectedTrail} pois={pois} map={mapInstance} />
                    </div>
                )}
            </div>
        </div>
    );
}