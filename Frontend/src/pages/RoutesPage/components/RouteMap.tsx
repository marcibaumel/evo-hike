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
}


const visualLayerStyle = { weight: 5, color: '#3388ff', interactive: false };
const interactionLayerStyle = { weight: 30, opacity: 0, lineCap: 'round' as const, lineJoin: 'round' as const };

const MapEventsHandler = ({ onContextMenu, onClick }: any) => {
    useMapEvents({ contextmenu: onContextMenu, click: onClick });
    return null;
};


export const RouteMap = ({ selectedTrailId, customGeojson, allGeojson, pois, onRouteCalculated, onMapReady, onTrailClick }: RouteMapProps) => {
    //const { t } = useTranslation();
    const [map, setMap] = useState<L.Map | null>(null);
    const [points, setPoints] = useState<{ start: [number, number] | null; end: [number, number] | null; mids: [number, number][]; }>({ start: null, end: null, mids: [] });
    const [selectionMode, setSelectionMode] = useState<'start' | 'end' | 'waypoint' | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, lat: number, lng: number } | null>(null);

    useEffect(() => { if (map) onMapReady(map); }, [map, onMapReady]);

    // Zoomolás a kiválasztott túrára
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
                if (selectionMode || points.start) return; // Ha épp navigálunk, ne válasszon ki túrát
                if (feature.properties?.id) onTrailClick(String(feature.properties.id));
            }
        });
    };

    const waypoints = useMemo(() => points.start && points.end ? [points.start, ...points.mids, points.end] : [], [points]);

    return (
        <div className="w-full h-full relative bg-gray-900 overflow-hidden">
            <MapContainer className={`h-full w-full z-0 outline-none ${selectionMode ? 'cursor-crosshair' : ''}`} center={[48.1007, 20.7897]} zoom={13} zoomControl={false} ref={setMap}>
                <MapEventsHandler
                    onClick={handleMapClick}
                    onContextMenu={(e: any) => setContextMenu({ x: e.originalEvent.clientX, y: e.originalEvent.clientY, lat: e.latlng.lat, lng: e.latlng.lng })}
                />

                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                

                {waypoints.length >= 2 && <RoutingMachine waypoints={waypoints} onRouteFound={(s) => onRouteCalculated(s.totalDistance, s.totalTime, s.coordinates)} />}

                {points.start && <Marker position={points.start} icon={startIcon}><Popup><button onClick={() => setPoints(p => ({...p, start: null}))} className="bg-red-500 text-white p-1 rounded text-xs"><MdDelete/></button></Popup></Marker>}
                {points.end && <Marker position={points.end} icon={endIcon}><Popup><button onClick={() => setPoints(p => ({...p, end: null}))} className="bg-red-500 text-white p-1 rounded text-xs"><MdDelete/></button></Popup></Marker>}
                {points.mids.map((p, i) => <Marker key={i} position={p} icon={waypointIcon}><Popup><button onClick={() => setPoints(prev => ({...prev, mids: prev.mids.filter((_, idx) => idx !== i)}))} className="bg-red-500 text-white p-1 rounded text-xs"><MdDelete/></button></Popup></Marker>)}

                {/* Kiválasztott túra (Kék vonal) és interakciós réteg (Láthatatlan, kattintható vastag vonal) */}
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
            <MapNavigationControls
                selectionMode={selectionMode}
                onSelectStartMode={() => setSelectionMode('start')}
                onSelectEndMode={() => setSelectionMode('end')}
                onSelectWaypointMode={() => setSelectionMode('waypoint')}
                onClear={() => setPoints({ start: null, end: null, mids: [] })}
            />

            {contextMenu && (
                <MapContextMenu
                    x={contextMenu.x} y={contextMenu.y}
                    onNavFrom={() => { setPoints(p => ({...p, start: [contextMenu.lat, contextMenu.lng]})); setContextMenu(null); }}
                    onNavTo={() => { setPoints(p => ({...p, end: [contextMenu.lat, contextMenu.lng]})); setContextMenu(null); }}
                    onAddWaypoint={() => { setPoints(p => ({...p, mids: [...p.mids, [contextMenu.lat, contextMenu.lng]]})); setContextMenu(null); }}
                    onClearNav={() => { setPoints({ start: null, end: null, mids: [] }); setContextMenu(null); }}
                />
            )}
        </div>
    );
};