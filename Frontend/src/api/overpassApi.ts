import axios from 'axios';

export interface OverpassElement {
    type: 'node' | 'way' | 'relation';
    id: number;
    lat: number;
    lon: number;
    tags?: {
        name?: string;
        tourism?: string;
        natural?: string;
        historic?: string;
        amenity?: string;
        [key: string]: string | undefined;
    };
}

interface OverpassResponse {
    elements: OverpassElement[];
}

const poiCache = new Map<string, OverpassElement[]>();
const CACHE_LIMIT = 50;

const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter',
    'https://overpass.nchc.org.tw/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter',
];

export const getNearbyPOIs = async (
    coordinates: { lat: number; lon: number }[],
    radius: number = 200,
): Promise<OverpassElement[]> => {
    if (!coordinates || coordinates.length === 0) return [];

    const targetPoints = 25;
    const step = Math.max(1, Math.ceil(coordinates.length / targetPoints));

    const sampledCoordinates = coordinates.filter((_, index) => index % step === 0);

    if (
        sampledCoordinates.length > 0 &&
        sampledCoordinates[sampledCoordinates.length - 1] !== coordinates[coordinates.length - 1]
    ) {
        sampledCoordinates.push(coordinates[coordinates.length - 1]);
    }

    const coordString = sampledCoordinates
        .map((c) => `${c.lat.toFixed(5)},${c.lon.toFixed(5)}`)
        .join(',');

    const cacheKey = `${radius}-${coordString}`;

    if (poiCache.has(cacheKey)) {
        const cachedData = poiCache.get(cacheKey)!;
        poiCache.delete(cacheKey);
        poiCache.set(cacheKey, cachedData);
        return cachedData;
    }

    const lats = sampledCoordinates.map((c) => c.lat);
    const lons = sampledCoordinates.map((c) => c.lon);

    const buffer = 0.005; // ~500m bounding box buffer
    const minLat = Math.min(...lats) - buffer;
    const maxLat = Math.max(...lats) + buffer;
    const minLon = Math.min(...lons) - buffer;
    const maxLon = Math.max(...lons) + buffer;

    const query = `
    [out:json][timeout:15][bbox:${minLat},${minLon},${maxLat},${maxLon}];
    (
        node["natural"~"^(peak|spring|cave_entrance|saddle)$"](around:${radius},${coordString});
        node["tourism"~"^(viewpoint|attraction|museum)$"](around:${radius},${coordString});
        node["historic"~"^(ruins|castle|memorial|monument)$"](around:${radius},${coordString});
        node["amenity"~"^(drinking_water|place_of_worship)$"](around:${radius},${coordString});
    );
    out body qt;
    `;

    for (let i = 0; i < OVERPASS_ENDPOINTS.length; i++) {
        const endpoint = OVERPASS_ENDPOINTS[i];
        try {
            const response = await axios.post<OverpassResponse>(
                endpoint,
                `data=${encodeURIComponent(query)}`,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    timeout: 15000
                }
            );

            if (poiCache.size >= CACHE_LIMIT) {
                const oldestKey = poiCache.keys().next().value;
                if (oldestKey) poiCache.delete(oldestKey);
            }

            poiCache.set(cacheKey, response.data.elements);
            return response.data.elements;

        } catch (error) {
            console.warn(`[Overpass API] Failed at ${endpoint}. Switching to next...`);
            
            if (i === OVERPASS_ENDPOINTS.length - 1) {
                console.error('[Overpass API] All endpoints failed.');
                return [];
            }
            
            const backoffTime = 1000 * (i + 1);
            await new Promise(res => setTimeout(res, backoffTime));
        }
    }

    return [];
};