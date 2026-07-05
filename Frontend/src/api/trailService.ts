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
    userPhotos?: string[];
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
    },
    getTrails: async () => {
        const response = await apiClient.get('/api/trails');
        return response.data;
    },
    deleteTrail: async (id: number) => {
        const response = await apiClient.delete(`/api/trails/${id}`);
        return response.data;
    }
};