import axios from 'axios';

// Típusok a válaszhoz
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

/**
 * Lekéri a nevezetességeket egy útvonal mentén (Around).
 * @param coordinates Az útvonal pontjai {lat, lon} formátumban
 * @param radius Keresési sugár méterben
 */
export const getNearbyPOIs = async (
    coordinates: { lat: number; lon: number }[],
    radius: number = 200
): Promise<OverpassElement[]> => {

    const targetPoints = 10;
    const step = Math.ceil(coordinates.length / targetPoints);
    const sampledCoordinates = coordinates.filter(
        (_, index) => index % step === 0
    );


    if (
        coordinates.length > 0 &&
        sampledCoordinates[sampledCoordinates.length - 1] !==
        coordinates[coordinates.length - 1]
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

    // Overpass QL lekérdezés összeállítása
    const query = `
    [out:json][timeout:90];
    node(around:${radius},${coordString})->.searchArea;
    (
      node.searchArea["natural"~"peak|spring|cave_entrance|saddle"];
      node.searchArea["tourism"~"viewpoint|attraction|museum"];
      node.searchArea["historic"~"ruins|castle|memorial|monument"];
      node.searchArea["amenity"~"drinking_water|place_of_worship"];
    );
    out body;
  `;

    try {
        const response = await axios.post<OverpassResponse>(
            'https://overpass-api.de/api/interpreter',
            `data=${encodeURIComponent(query)}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (poiCache.size >= CACHE_LIMIT) {
            const oldestKey = poiCache.keys().next().value;
            if (oldestKey) {
                // eslint-disable-next-line no-console
                console.log('Cache limit elérve, legrégebbi elem törlése:', oldestKey);
                poiCache.delete(oldestKey);
            }
        }


        poiCache.set(cacheKey, response.data.elements);
        return response.data.elements;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Hiba az Overpass API lekérdezésekor:', error);
        return [];
    }
};
