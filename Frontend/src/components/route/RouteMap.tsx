/* eslint-disable no-console */
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { divIcon, point } from 'leaflet';
import type { FeatureCollection } from 'geojson';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { useState, useMemo, useEffect, useRef } from 'react';
import RoutingMachine from '../RoutingMachine';
import { Button } from '../ui/Button';
import { FlagIcon, MapPinIcon, XIcon, PlusIcon } from '@phosphor-icons/react';

interface RouteMapProps {
    geojson: FeatureCollection;
    onRouteCalculated?: (distance: number, time: number, coordinates: [number, number][]) => void;
}

const createClusterCustomIcon = (cluster: { getChildCount: () => number }) => {
    return divIcon({
        html: `<span class="flex items-center justify-center w-8 h-8 bg-brand-accent text-brand-dark font-bold rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2">${cluster.getChildCount()}</span>`,
        className: 'custom-marker-cluster',
        iconSize: point(33, 33, true)
    });
};

const MapClickHandler = ({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) => {
    useMapEvents({
        click: onClick
    });
    return null;
};

const MapBoundsHandler = ({ geojson }: { geojson: FeatureCollection }) => {
    const map = useMap();

    useEffect(() => {
        if (!geojson || !map) return;

        try {
            const layer = L.geoJSON(geojson);
            const bounds = layer.getBounds();

            if (bounds.isValid()) {
                map.fitBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: 15,
                    animate: true,
                    duration: 1
                });
            }
        } catch (e) {
            console.error('Error calculating bounds:', e);
        }
    }, [geojson, map]);

    return null;
};

const TrailMarkers = ({ geojson }: { geojson: FeatureCollection }) => {
    const [markers, setMarkers] = useState<{
        start: [number, number] | null;
        end: [number, number] | null;
    }>({ start: null, end: null });

    useEffect(() => {
        if (!geojson || !geojson.features || geojson.features.length === 0) {
            setMarkers({ start: null, end: null });
            return;
        }

        try {
            const layer = L.geoJSON(geojson);
            const layers = layer.getLayers();

            if (layers.length > 0) {
                const firstLayer = layers[0] as L.Polyline;

                if (firstLayer.getLatLngs) {
                    const latlngs = firstLayer.getLatLngs();
                    // Handle nested arrays from MultiPolyline/MultiPolygon
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const flatLatLngs = (latlngs as any[]).flat(Infinity) as L.LatLng[];

                    if (flatLatLngs.length > 0) {
                        const start = flatLatLngs[0];
                        const end = flatLatLngs[flatLatLngs.length - 1];
                        setMarkers({
                            start: [start.lat, start.lng],
                            end: [end.lat, end.lng]
                        });
                    }
                }
            }
        } catch (e) {
            console.error('Error parsing trail markers:', e);
        }
    }, [geojson]);

    if (!markers.start || !markers.end) return null;

    return (
        <>
            <Marker
                position={markers.start}
                icon={divIcon({
                    className: 'bg-transparent',
                    html: '<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">S</div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })}
            />
            <Marker
                position={markers.end}
                icon={divIcon({
                    className: 'bg-transparent',
                    html: '<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">E</div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })}
            />
        </>
    );
};

export const RouteMap = ({ geojson, onRouteCalculated }: RouteMapProps) => {
    const { t } = useTranslation();
    const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
    const [midPoints, setMidPoints] = useState<[number, number][]>([]);
    const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
    const [placementMode, setPlacementMode] = useState<'start' | 'mid' | 'end' | null>(null);
    const geoJsonRef = useRef<L.GeoJSON>(null);

    useEffect(() => {
        if (geoJsonRef.current) {
            geoJsonRef.current.clearLayers();
            if (geojson) {
                geoJsonRef.current.addData(geojson);
            }
        }
    }, [geojson]);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (!placementMode) return;
        const { lat, lng } = e.latlng;
        const point: [number, number] = [lat, lng];

        if (placementMode === 'start') {
            setStartPoint(point);
            setPlacementMode(null);
        } else if (placementMode === 'mid') {
            setMidPoints([...midPoints, point]);
        } else if (placementMode === 'end') {
            setEndPoint(point);
            setPlacementMode(null);
        }
    };

    const clearRoute = () => {
        setStartPoint(null);
        setMidPoints([]);
        setEndPoint(null);
        setPlacementMode(null);
    };

    const waypoints = useMemo(() => {
        const points: [number, number][] = [];
        if (startPoint) points.push(startPoint);
        points.push(...midPoints);
        if (endPoint) points.push(endPoint);
        return points;
    }, [startPoint, midPoints, endPoint]);

    return (
        <div className="w-full lg:w-2/3 h-[50vh] lg:h-full relative bg-gray-900 overflow-hidden">
            <MapContainer
                className="h-full w-full z-0 outline-none"
                center={[48.1007, 20.7897]}
                zoom={13}
                zoomControl={false}>
                <MapClickHandler onClick={handleMapClick} />
                <MapBoundsHandler geojson={geojson} />
                <TrailMarkers geojson={geojson} />
                <TileLayer
                    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
                    className="map-tiles"
                />

                <GeoJSON ref={geoJsonRef} data={geojson} style={{ color: '#22c55e', weight: 4, opacity: 0.8 }} />

                <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                    <Marker position={[51.505, -0.09]}>
                        <Popup className="custom-popup">
                            <div className="font-sans text-brand-dark">
                                <strong className="block text-lg mb-1">Popup 1</strong>
                                <p className="text-sm">Description goes here.</p>
                            </div>
                        </Popup>
                    </Marker>
                    <Marker position={[51.504, -0.1]}>
                        <Popup>This is popup 2</Popup>
                    </Marker>
                    <Marker position={[51.5, -0.09]}>
                        <Popup>This is popup 3</Popup>
                    </Marker>
                </MarkerClusterGroup>

                {/* Custom Route Markers */}
                {startPoint && (
                    <Marker
                        position={startPoint}
                        icon={divIcon({
                            className: 'bg-transparent',
                            html: '<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })}
                    />
                )}
                {midPoints.map((p, i) => (
                    <Marker
                        key={i}
                        position={p}
                        icon={divIcon({
                            className: 'bg-transparent',
                            html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>',
                            iconSize: [16, 16],
                            iconAnchor: [8, 8]
                        })}
                    />
                ))}
                {endPoint && (
                    <Marker
                        position={endPoint}
                        icon={divIcon({
                            className: 'bg-transparent',
                            html: '<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md"></div>',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })}
                    />
                )}

                {/* Routing Machine */}
                {waypoints.length >= 2 && (
                    <RoutingMachine
                        waypoints={waypoints}
                        onRouteFound={(summary) => {
                            if (onRouteCalculated) {
                                onRouteCalculated(summary.totalDistance, summary.totalTime, summary.coordinates);
                            }
                        }}
                    />
                )}
            </MapContainer>

            {/* Map Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] z-400" />

            {/* Route Creation Controls */}
            <div className="absolute top-6 right-6 z-[500] flex flex-col gap-2">
                <Card variant="glass" className="p-2 flex flex-col gap-2">
                    <Button
                        variant={placementMode === 'start' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setPlacementMode(placementMode === 'start' ? null : 'start')}
                        className="justify-start gap-2">
                        <FlagIcon size={16} className="text-green-500" />
                        {startPoint ? t('route.edit_start', 'Edit Start') : t('route.set_start', 'Set Start')}
                    </Button>

                    <Button
                        variant={placementMode === 'mid' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setPlacementMode(placementMode === 'mid' ? null : 'mid')}
                        className="justify-start gap-2">
                        <PlusIcon size={16} className="text-blue-500" />
                        {t('route.add_point', 'Add Point')}
                    </Button>

                    <Button
                        variant={placementMode === 'end' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setPlacementMode(placementMode === 'end' ? null : 'end')}
                        className="justify-start gap-2">
                        <MapPinIcon size={16} className="text-red-500" />
                        {endPoint ? t('route.edit_end', 'Edit End') : t('route.set_end', 'Set End')}
                    </Button>

                    {(startPoint || midPoints.length > 0 || endPoint) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearRoute}
                            className="mt-2 justify-start gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10">
                            <XIcon size={16} />
                            {t('route.clear', 'Clear Route')}
                        </Button>
                    )}
                </Card>
            </div>

            {/* Legend / Info Overlay example using Card */}
            <div className="absolute bottom-6 left-6 z-500">
                <Card variant="glass" className="p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <span className="w-3 h-3 rounded-full bg-brand-accent" />
                        {t('route.active_trails')}
                    </div>
                </Card>
            </div>
        </div>
    );
};
