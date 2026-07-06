import type { FeatureCollection } from 'geojson';

export const parseGpxToGeoJSON = (gpxString: string): FeatureCollection | null => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxString, 'text/xml');
        const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt'));

        if (trackPoints.length === 0) return null;

        const coordinates = trackPoints.map((pt) => [
            parseFloat(pt.getAttribute('lon')!),
            parseFloat(pt.getAttribute('lat')!)
        ]);

        return {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    }
                }
            ]
        };
    } catch (e) {
        console.error('Hiba a GPX feldolgozása közben:', e);
        return null;
    }
};

export const calculateElevationGain = async (coordinates: [number, number][]): Promise<number> => {
    if (!coordinates || coordinates.length === 0) return 0;

    try {
        const step = Math.max(1, Math.ceil(coordinates.length / 100));
        const sampledCoords = coordinates.filter((_, index) => index % step === 0);
        
        const payload = {
            locations: sampledCoords.map(c => ({ latitude: c[0], longitude: c[1] }))
        };
        
        const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) return 0;

        const data = await response.json();
        const results = data.results;
        
        let totalGain = 0;
        for (let i = 1; i < results.length; i++) {
            const diff = results[i].elevation - results[i - 1].elevation;
            if (diff > 0) {
                totalGain += diff;
            }
        }

        return Math.round(totalGain);
    } catch (error) {
        console.error("Nem sikerült lekérni az emelkedést:", error);
        return 0;
    }
};

export const calculateDistanceInMeters = (coords: [number, number][]) => {
    let totalDistance = 0;
    const R = 6371e3;

    for (let i = 0; i < coords.length - 1; i++) {
        const lat1 = (coords[i][0] * Math.PI) / 180;
        const lat2 = (coords[i+1][0] * Math.PI) / 180;
        const deltaLat = ((coords[i+1][0] - coords[i][0]) * Math.PI) / 180;
        const deltaLon = ((coords[i+1][1] - coords[i][1]) * Math.PI) / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        totalDistance += R * c;
    }
    return Math.round(totalDistance);
};