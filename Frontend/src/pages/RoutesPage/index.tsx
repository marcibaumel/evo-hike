import { useState, useCallback, useMemo, useEffect } from 'react';
import type { FeatureCollection } from 'geojson';
//import { useTranslation } from 'react-i18next';
import { RouteMap } from './components/RouteMap';
import RouteEditorPanel from './components/RouteEditorPanel';
import TrailListPanel from './components/TrailListPanel';
//import PlanHikeModal from './components/PlanHikeModel';
import SelectedTrailDetails from './components/SelectedTrailDetails';
import { Trail } from '../../utils/Trail';
import { getNearbyPOIs, type OverpassElement } from '../../api/overpassApi';
import routeData from '../../assets/mockData/routes.json';
import backendTrails from '../../assets/mockData/backendTrails.json';
import type { DifficultyLevel } from '../../utils/difficulty.ts';

const geojson = routeData as FeatureCollection;

export default function RoutePage() {
   // const { t } = useTranslation();

    // --- ÁLLAPOTOK ---
    const [userTrails, setUserTrails] = useState<any[]>([]);
    const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
    const [pois, setPois] = useState<OverpassElement[]>([]);
    const [isCreatingRoute, setIsCreatingRoute] = useState(false);
    //const [planningTrail, setPlanningTrail] = useState<{ id: number; name: string } | null>(null);
    const [mapInstance, setMapInstance] = useState<any>(null);

    // Egyedi útvonalhoz
    const [customRoute, setCustomRoute] = useState({ name: '', description: '', distance: 0, time: 0, coordinates: [] as [number, number][] });
    const [uploadedGpx, setUploadedGpx] = useState<FeatureCollection | null>(null);

    // --- ADATOK BETÖLTÉSE ---
    useEffect(() => {
        const saved = localStorage.getItem('userTrails');
        if (saved) {
            try { setUserTrails(JSON.parse(saved)); } catch (e) { console.error('Failed to parse user trails', e); }
        }
    }, []);

    const allTrails = useMemo(() => {
        return [...userTrails, ...backendTrails].map(t => new Trail({
            ...t,
            difficulty: (t.difficulty === 'Easy' ? 0 : t.difficulty === 'Moderate' ? 1 : t.difficulty === 'Hard' ? 2 : 3) as DifficultyLevel
        }));
    }, [userTrails]);

    // --- POI LEKÉRÉS ---
    const fetchPOIs = useCallback(async (coordinates: [number, number][]) => {
        const results = await getNearbyPOIs(coordinates.map(([lon, lat]) => ({ lat, lon })), 200);
        setPois(results.filter(p => p.tags?.name));
    }, []);

    // --- KIVÁLASZTÁS LISTÁBÓL VAGY TÉRKÉPRŐL ---
    const handleTrailSelect = useCallback((trailId: string) => {
        const trail = allTrails.find(t => String(t.id) === String(trailId));
        if (trail) {
            setSelectedTrail(trail);
            // Ha van geojson adata (pl. saját vagy mock), akkor lekérjük a POI-kat a vonal mentén
            const feature = geojson.features.find(f => String(f.properties?.id) === String(trailId)) || trail.geojson;
            if (feature && feature.geometry.type === 'LineString') {
                fetchPOIs(feature.geometry.coordinates as [number, number][]);
            }
        }
    }, [allTrails, fetchPOIs]);

    // --- ÚTVONAL MENTÉSE (local) ---
    const handleSaveNewRoute = () => {
        if (!customRoute.name) return alert('Kérlek add meg a túra nevét!');

        const newId = `user-${Date.now()}`;
        const newTrail = {
            id: newId,
            name: customRoute.name,
            location: 'Custom Route',
            length: customRoute.distance,
            difficulty: customRoute.distance < 5000 ? 'Easy' : customRoute.distance > 15000 ? 'Hard' : 'Moderate',
            elevationGain: 0,
            time: customRoute.time,
            rating: 0, reviewCount: 0, coverPhotoPath: '', description: customRoute.description, userPhotos: [],
            geojson: uploadedGpx || { type: 'Feature', properties: { id: newId, name: customRoute.name }, geometry: { type: 'LineString', coordinates: customRoute.coordinates } }
        };

        const updated = [newTrail, ...userTrails];
        setUserTrails(updated);
        localStorage.setItem('userTrails', JSON.stringify(updated));

        setIsCreatingRoute(false);
        setCustomRoute({ name: '', description: '', distance: 0, time: 0, coordinates: [] });
        setUploadedGpx(null);
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen pt-20 bg-brand-dark overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-full lg:w-1/3 flex flex-col border-r border-white/10 bg-brand-dark z-20 relative h-full">
                {isCreatingRoute ? (
                    <RouteEditorPanel
                        name={customRoute.name} description={customRoute.description} distance={customRoute.distance} time={customRoute.time}
                        onNameChange={(val) => setCustomRoute(p => ({...p, name: val}))}
                        onDescriptionChange={(val) => setCustomRoute(p => ({...p, description: val}))}
                        onSave={handleSaveNewRoute}
                        closeRouteEditor={() => setIsCreatingRoute(false)}
                        onGpxLoaded={(data) => setUploadedGpx(data)}
                    />
                ) : (
                    <TrailListPanel onSelectTrail={handleTrailSelect} onStartCreateRoute={() => setIsCreatingRoute(true)} />
                )}
            </div>

            {/* TÉRKÉP ENGINE */}
            <div className="relative flex-1 h-full">
                <RouteMap
                    selectedTrailId={selectedTrail?.id}
                    customGeojson={uploadedGpx}
                    allGeojson={geojson}
                    pois={pois}
                    onRouteCalculated={(d, t, c) => setCustomRoute(p => ({ ...p, distance: d, time: t, coordinates: c }))}
                    onMapReady={setMapInstance}
                    onTrailClick={handleTrailSelect}
                />

                {selectedTrail && (
                    <div className="absolute bottom-6 right-6 left-6 lg:left-auto lg:w-96 z-[1000] animate-fadeIn">
                        <SelectedTrailDetails trail={selectedTrail} pois={pois} map={mapInstance} />
                    </div>
                )}
            </div>

            {/* {planningTrail && <PlanHikeModal routeId={planningTrail.id} trailName={planningTrail.name} onClose={() => setPlanningTrail(null)} />}*/}
        </div>
    );
}