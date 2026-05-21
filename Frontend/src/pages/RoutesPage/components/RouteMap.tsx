import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { latLngBounds } from 'leaflet';
//import { useTranslation } from 'react-i18next';
import RoutingMachine from './RoutingMachine';
import MapContextMenu from './MapContextMenu';
import MapLegend from './MapLegend';
import MapNavigationControls from './MapNavigationControls';
import { MdDelete } from 'react-icons/md';
import { createClusterCustomIcon, startIcon, endIcon, waypointIcon, getIconForPoi } from '../../../utils/mapIcons';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
    selectedTrailId?: string;
    customGeojson?: any; 
    allGeojson: any; 
    pois: any[];
    onRouteCalculated: (dist: number, time: number, coords: [number, number][]) => void;
    onMapReady: (map: L.Map) => void;
    onTrailClick: (trailId: string) => void;
    onClear: () => void;
    creatingRouteState: boolean;
    
    points: { start: [number, number] | null; end: [number, number] | null; mids: [number, number][]; };
    setPoints: React.Dispatch<React.SetStateAction<{ start: [number, number] | null; end: [number, number] | null; mids: [number, number][]; }>>;
}


const visualLayerStyle = { weight: 5, color: '#3388ff', interactive: false };
const interactionLayerStyle = { weight: 30, opacity: 0, lineCap: 'round' as const, lineJoin: 'round' as const };

const MapEventsHandler = ({ onContextMenu, onClick }: any) => {
    useMapEvents({ contextmenu: onContextMenu, click: onClick });
    return null;
};


export const RouteMap = ({ selectedTrailId, customGeojson, allGeojson, pois, onRouteCalculated, onMapReady, onTrailClick, onClear, creatingRouteState, points, setPoints }: RouteMapProps) => {
    //const { t } = useTranslation();
    const [map, setMap] = useState<L.Map | null>(null);
    const [selectionMode, setSelectionMode] = useState<'start' | 'end' | 'waypoint' | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, lat: number, lng: number } | null>(null);

    useEffect(() => { if (map) onMapReady(map); }, [map, onMapReady]);
    
    const selectedFeature = useMemo(() => {
        if (!selectedTrailId) return null;
        return allGeojson.features.find((f: any) => String(f.properties?.id) === String(selectedTrailId));
    }, [selectedTrailId, allGeojson]);

    useEffect(() => {
        if (map && selectedFeature && selectedFeature.geometry.type === 'LineString') {
            const coords = selectedFeature.geometry.coordinates.map(([lon, lat]: any) => [lat, lon]);
            map.fitBounds(latLngBounds(coords), { padding: [50, 50], animate: true });
        }
    }, [selectedFeature, map]);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (contextMenu) { setContextMenu(null); return; }
        if (!selectionMode) return;
        const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
        if (selectionMode === 'start') setPoints(p => ({...p, start: pos}));
        else if (selectionMode === 'end') setPoints(p => ({...p, end: pos}));
        else if (selectionMode === 'waypoint') setPoints(p => ({...p, mids: [...p.mids, pos]}));
        setSelectionMode(null);
    };

    const onEachFeature = (feature: any, layer: L.Layer) => {
        layer.on({
            click: () => {
                if (selectionMode || points.start) return; 
                if (feature.properties?.id) onTrailClick(String(feature.properties.id));
            }
        });
    };

    useEffect(() => {
        if (!points.start || !points.end) {
            onRouteCalculated(0, 0, []);
        }
    }, [points.start, points.end]);

    const waypoints = useMemo(() => points.start && points.end ? [points.start, ...points.mids, points.end] : [], [points]);

    return (
        <div className="w-full h-full relative bg-gray-900 overflow-hidden">
            <MapContainer className={`h-full w-full z-0 outline-none ${selectionMode ? 'cursor-crosshair' : ''}`} center={[48.1007, 20.7897]} zoom={13} zoomControl={false} ref={setMap}>
                <MapEventsHandler
                    onClick={handleMapClick}
                    onContextMenu={(e: any) => setContextMenu({ x: e.originalEvent.clientX, y: e.originalEvent.clientY, lat: e.latlng.lat, lng: e.latlng.lng })}
                />

                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


                {points.start && points.end && waypoints.length >= 2 && (
                    <RoutingMachine
                        waypoints={waypoints}
                        onRouteFound={(s) => onRouteCalculated(s.totalDistance, s.totalTime, s.coordinates)}
                    />
                )}
                
                {points.start && (
                    <Marker position={points.start} icon={startIcon}>
                        <Popup closeButton={false} autoPan={false} className="custom-delete-popup">
                            <button
                                onClick={() => setPoints(p => ({...p, start: null}))}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors duration-200 flex items-center justify-center cursor-pointer"
                                title="Pont törlése"
                            >
                                <MdDelete size={18} />
                            </button>
                        </Popup>
                    </Marker>
                )}
                
                {points.end && (
                    <Marker position={points.end} icon={endIcon}>
                        <Popup closeButton={false} autoPan={false} className="custom-delete-popup">
                            <button
                                onClick={() => setPoints(p => ({...p, end: null}))}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors duration-200 flex items-center justify-center cursor-pointer"
                                title="Pont törlése"
                            >
                                <MdDelete size={18} />
                            </button>
                        </Popup>
                    </Marker>
                )}
                
                {points.mids.map((p, i) => (
                    <Marker key={i} position={p} icon={waypointIcon}>
                        <Popup closeButton={false} autoPan={false} className="custom-delete-popup">
                            <button
                                onClick={() => setPoints(prev => ({...prev, mids: prev.mids.filter((_, idx) => idx !== i)}))}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors duration-200 flex items-center justify-center cursor-pointer"
                                title="Pont törlése"
                            >
                                <MdDelete size={18} />
                            </button>
                        </Popup>
                    </Marker>
                ))}
                
                {selectedFeature && <GeoJSON key={`visual-${selectedTrailId}`} data={selectedFeature} style={visualLayerStyle} />}
                {selectedFeature && <GeoJSON key={`interact-${selectedTrailId}`} data={selectedFeature} style={interactionLayerStyle} onEachFeature={onEachFeature} />}

                {/* Feltöltött GPX (Kék szaggatott vonal) */}
                {customGeojson && <GeoJSON key="custom-gpx" data={customGeojson} style={{ ...visualLayerStyle, dashArray: '10, 10' }} />}
                
                <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                    {pois && pois.length > 0 && pois.map((poi) => (
                        <Marker
                            key={poi.id}
                            position={[poi.lat, poi.lon]}
                            icon={getIconForPoi(poi)}
                        >
                            <Popup className="custom-popup">{poi.tags?.name}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            <MapLegend />
            {creatingRouteState && (
            <MapNavigationControls
                selectionMode={selectionMode}
                onSelectStartMode={() => setSelectionMode('start')}
                onSelectEndMode={() => setSelectionMode('end')}
                onSelectWaypointMode={() => setSelectionMode('waypoint')}
                onClear={onClear}
            />
            )}

            {(contextMenu && creatingRouteState) && (
                <MapContextMenu
                    x={contextMenu.x} y={contextMenu.y}
                    onNavFrom={() => { setPoints(p => ({...p, start: [contextMenu.lat, contextMenu.lng]})); setContextMenu(null); }}
                    onNavTo={() => { setPoints(p => ({...p, end: [contextMenu.lat, contextMenu.lng]})); setContextMenu(null); }}
                    onAddWaypoint={() => { setPoints(p => ({...p, mids: [...p.mids, [contextMenu.lat, contextMenu.lng]]})); setContextMenu(null); }}
                    onClearNav={() => {
                        onClear();
                        setContextMenu(null); 
                    }}
                />
            )}
        </div>
    );
};