import type { DifficultyLevel } from './difficulty';
import type { Feature, FeatureCollection } from 'geojson';

export class Trail {
    id: string;
    name: string;
    location: string;
    length: number;
    difficulty: DifficultyLevel;
    elevationGain: number;
    time: number;
    rating: number;
    reviewCount: number;
    coverPhotoPath: string;
    description: string;
    userPhotos: string[];
    geojson?: FeatureCollection | Feature | null;
    startPoint?: { lat: number, lng: number } | null;
    endPoint?: { lat: number, lng: number } | null;
    waypoints?: { lat: number, lng: number }[];

    constructor(data: {
        id: string;
        name: string;
        location: string;
        length: number;
        difficulty: DifficultyLevel;
        elevationGain: number;
        time: number;
        rating: number;
        reviewCount: number;
        coverPhotoPath: string;
        description?: string;
        userPhotos?: string[];
        geojson?: FeatureCollection | Feature | null;
        startPoint?: { lat: number, lng: number } | null;
        endPoint?: { lat: number, lng: number } | null;
        waypoints?: { lat: number, lng: number }[];
        
    }) {
        this.id = data.id;
        this.name = data.name;
        this.location = data.location;
        this.length = data.length;
        this.difficulty = data.difficulty;
        this.elevationGain = data.elevationGain;
        this.time = data.time;
        this.rating = data.rating;
        this.reviewCount = data.reviewCount;
        this.coverPhotoPath = data.coverPhotoPath;
        this.description = data.description || '';
        this.userPhotos = data.userPhotos || [];
        this.geojson = data.geojson;
        this.startPoint = data.startPoint || null;
        this.endPoint = data.endPoint || null;
        this.waypoints = data.waypoints || [];
    }
}
