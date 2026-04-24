import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap } from 'react-leaflet';

interface RoutingMachineProps {
    waypoints: [number, number][];
    onRouteFound?: (summary: { totalDistance: number; totalTime: number; coordinates: [number, number][] }) => void;
}

export default function RoutingMachine({ waypoints, onRouteFound }: RoutingMachineProps) {
    const map = useMap();
    const onRouteFoundRef = useRef(onRouteFound);

    useEffect(() => {
        onRouteFoundRef.current = onRouteFound;
    }, [onRouteFound]);

    useEffect(() => {
        if (!map) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const routingControl = (L as any).Routing.control({
            waypoints: waypoints.map((p) => L.latLng(p[0], p[1])),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router: (L as any).Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                profile: 'driving' // A dokumentációs probléma megkerülése
            }),
            routeWhileDragging: false,
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight: 5 }]
            },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            showAlternatives: true,
            createMarker: () => null
        }).addTo(map);

        const container = routingControl.getContainer();
        if (container) {
            container.style.display = 'none';
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        routingControl.on('routesfound', function (e: any) {
            const routes = e.routes;
            const summary = routes[0].summary;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const coordinates = routes[0].coordinates.map((c: any) => [c.lng, c.lat]);

            const walkingSpeedMetersPerSecond = 4000 / 3600; // 4km/h átlagsebesség
            const correctedTime = summary.totalDistance / walkingSpeedMetersPerSecond;

            if (onRouteFoundRef.current) {
                onRouteFoundRef.current({
                    totalDistance: summary.totalDistance,
                    totalTime: correctedTime,
                    coordinates: coordinates
                });
            }
        });

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, waypoints]);

    return null;
}