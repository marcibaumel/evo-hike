import { useState, useCallback, useMemo, useEffect } from 'react';
import type { FeatureCollection, Feature } from 'geojson';
import { Map } from 'leaflet';
import { MagnifyingGlassIcon, SlidersHorizontalIcon, PlusIcon } from 'lucide-react'; 

import { RouteMap } from './components/RouteMap';
import RouteEditorPanel from './components/RouteEditorPanel';
import SelectedTrailDetails from './components/SelectedTrailDetails';
import { FilterPanel } from './components/FilterPanel'; 
import { TrailCard } from './components/TrailCard'; 
import { Button } from '../../components/Button';

import { Trail } from '../../utils/Trail';
import type { DifficultyLevel } from '../../utils/difficulty';
import { useTrailFilters } from '../../hooks/useTrailFilters'; 
import { getNearbyPOIs, type OverpassElement } from '../../api/overpassApi';
import routeData from '../../assets/mockData/routes.json';
import backendTrails from '../../assets/mockData/backendTrails.json';

import './routespage.css';

const geojson = routeData as FeatureCollection;
const emptyGeoJson: FeatureCollection = { type: 'FeatureCollection', features: [] };
type TrailData = any;
type ViewState = 'list' | 'create' | 'filter';

export default function RoutePage() {
  
  const [displayedGeoJson, setDisplayedGeoJson] = useState<FeatureCollection>(emptyGeoJson);
  const [userTrails, setUserTrails] = useState<TrailData[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [pois, setPois] = useState<OverpassElement[]>([]);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [view, setView] = useState<ViewState>('list');

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

  const allTrails = useMemo(() => {
    const combined = [...userTrails, ...backendTrails] as Record<string, unknown>[];

    return combined.map(t => {
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
        time: Number(t.time) || 0,
        rating: Number(t.rating) || 0,
        reviewCount: Number(t.reviewCount) || 0,
        coverPhotoPath: String(t.coverPhotoPath || ''),
        description: String(t.description || ''),
        userPhotos: (t.userPhotos as string[]) || [],
        geojson: t.geojson as FeatureCollection | Feature | null | undefined,
        difficulty: diffLevel
      });
    });
  }, [userTrails]);

  const { filteredTrails, filters, setFilters } = useTrailFilters(allTrails);

  const fetchPOIs = useCallback(async (coordinates: [number, number][]) => {
    try {
      const results = await getNearbyPOIs(coordinates.map(([lon, lat]) => ({ lat, lon })), 200);
      setPois(results.filter(p => p.tags?.name));
    } catch (error) {
      console.error("Failed to fetch POIs", error);
    }
  }, []);

  const handleTrailSelect = useCallback((trailId: string) => {
    const trail = allTrails.find(t => String(t.id) === String(trailId));
    if (trail) {
      setSelectedTrail(trail);

      const geoData = geojson.features.find(f => String(f.properties?.id) === String(trailId)) || trail.geojson;

      if (geoData) {
        if (geoData.type === 'Feature' && geoData.geometry?.type === 'LineString') {
          fetchPOIs(geoData.geometry.coordinates as [number, number][]);
        } else if (geoData.type === 'FeatureCollection') {
          const lineStringFeature = geoData.features.find(f => f.geometry?.type === 'LineString');
          if (lineStringFeature && lineStringFeature.geometry?.type === 'LineString') {
            fetchPOIs(lineStringFeature.geometry.coordinates as [number, number][]);
          }
        }
        
        if (geoData.type === 'FeatureCollection') {
          setDisplayedGeoJson(geoData);
        } else if (geoData.type === 'Feature') {
          setDisplayedGeoJson({ type: 'FeatureCollection', features: [geoData] });
        }
      }
    }
  }, [allTrails, fetchPOIs]);

  const handleSaveNewRoute = () => {
    if (!customRoute.name) return alert('Kérlek add meg a túra nevét!');

    const newId = `user-${Date.now()}`;

    const newTrail: ConstructorParameters<typeof Trail>[0] = {
      id: newId,
      name: customRoute.name,
      location: 'Custom Route',
      length: customRoute.distance,
      difficulty: (customRoute.distance < 5000 ? 0 : customRoute.distance > 15000 ? 2 : 1) as DifficultyLevel,
      elevationGain: 0,
      time: customRoute.time,
      rating: 0,
      reviewCount: 0,
      coverPhotoPath: '',
      description: customRoute.description,
      userPhotos: [],
      geojson: uploadedGpx || ({
        type: 'Feature',
        properties: { id: newId, name: customRoute.name },
        geometry: { type: 'LineString', coordinates: customRoute.coordinates }
      } as Feature)
    };

    const updated = [newTrail, ...userTrails];
    setUserTrails(updated);
    localStorage.setItem('userTrails', JSON.stringify(updated));

    setView('list');
    handleResetForm();
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

  const handleDeleteTrail = (id: string) => {
    const updated = userTrails.filter(t => String(t.id) !== id);
    setUserTrails(updated);
    localStorage.setItem('userTrails', JSON.stringify(updated));
    if (selectedTrail?.id === id) setSelectedTrail(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen pt-20 bg-brand-dark overflow-hidden">
      <div className="w-full lg:w-1/3 flex flex-col border-r border-white/10 bg-brand-dark z-20 relative h-full">
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
            onGpxLoaded={(data) => { setUploadedGpx(data); setDisplayedGeoJson(data || emptyGeoJson); }}
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
                    placeholder="Search trails..."
                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50 transition-colors"
                  />
                </div>
                <Button variant="primary" className="p-2.5 rounded-xl h-auto bg-brand-accent hover:bg-brand-accent/90" size="sm" onClick={() => setView('filter')} title="Filter trails">
                  <SlidersHorizontalIcon size={20} />
                </Button>
                <Button variant="primary" className="p-2.5 rounded-xl h-auto bg-brand-accent hover:bg-brand-accent/90" size="sm" onClick={() => setView('create')} title="Create new route">
                  <PlusIcon size={20} className="text-brand-dark" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredTrails.map((trail) => (
                <div key={trail.id} className="hover:scale-[1.01] transition-transform duration-300">
                  <TrailCard
                    trail={trail}
                    onViewDetails={() => handleTrailSelect(trail.id)}
                    onDelete={trail.id.startsWith('user-') ? () => handleDeleteTrail(trail.id) : undefined}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="relative flex-1 h-full">
        <RouteMap
          selectedTrailId={selectedTrail?.id}
          customGeojson={uploadedGpx || displayedGeoJson}
          allGeojson={geojson}
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