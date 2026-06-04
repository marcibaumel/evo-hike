import type { DifficultyLevel } from './difficulty';
import { Trail } from './Trail';

export class TrailFilters {
    searchText: string;
    difficulty: DifficultyLevel[];
    minLength:  number | null;
    maxLength: number | null;
    minElevation: number | null;
    maxElevation: number | null;
    maxTime: number | null;
    minRating: number | null;

    constructor(data: {
        searchText: string;
        difficulty: DifficultyLevel[];
        minLength: number | null ;
        maxLength: number | null;
        minElevation: number | null;
        maxElevation: number | null;
        maxTime: number | null;
        minRating: number | null;
    }) {
        this.searchText = data.searchText;
        this.difficulty = data.difficulty;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
        this.minElevation = data.minElevation;
        this.maxElevation = data.maxElevation;
        this.maxTime = data.maxTime;
        this.minRating = data.minRating;
    }

    public matchesSearch = (trail: Trail) => {
        if (!this.searchText) return true;
        const lowerText = this.searchText.toLowerCase();
        return trail.name.toLowerCase().includes(lowerText) ||
               trail.location.toLowerCase().includes(lowerText);
    };

    public matchesDifficulty = (trail: Trail) => {
        if (this.difficulty.length === 0) return true;
        return this.difficulty.includes(trail.difficulty);
    };

    private matchesRange = (value: number, min: number | null, max: number | null) => {
        if (min !== null && value < min) return false;
        if (max !== null && value > max) return false;
        return true;
    };

    public matches = (trail: Trail): boolean => {
        const minMeters = this.minLength !== null ? this.minLength * 1000 : null;
        const maxMeters = this.maxLength !== null ? this.maxLength * 1000 : null;

        return (
            this.matchesSearch(trail) &&
            this.matchesDifficulty(trail) &&
            this.matchesRange(trail.length, minMeters, maxMeters) &&
            this.matchesRange(trail.elevationGain, this.minElevation, this.maxElevation) &&
            this.matchesRange(trail.time, null, this.maxTime) &&
            this.matchesRange(trail.rating, this.minRating, null)
        );
    };

    public clone = (): TrailFilters => {
        return new TrailFilters({
            searchText: this.searchText,
            difficulty: [...this.difficulty],
            minLength: this.minLength,
            maxLength: this.maxLength,
            minElevation: this.minElevation,
            maxElevation: this.maxElevation,
            maxTime: this.maxTime,
            minRating: this.minRating
        });
    };
}