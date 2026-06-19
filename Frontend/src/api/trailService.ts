import apiClient from './Client';

export interface RouteLineGeoJSON {
    type: 'LineString';
    coordinates: [number, number][];
}

export interface CreateTrailRequest {
    name: string;
    description: string;
    length: number;
    difficulty: number;
    time: number;
    routeLine: RouteLineGeoJSON; 
}

export const trailService = {
    createTrail: async (data: CreateTrailRequest) => {
        const payload = {
            ...data,
            routeLine: JSON.stringify(data.routeLine)
        };

        console.log("--- [Frontend] Küldöm a stringesített adatot ---", payload);
        const response = await apiClient.post('/api/trails', payload);
        return response.data;
    }
};