import { TrailFilters } from '../utils/filters';
import { Trail } from '../utils/Trail';
import { useState,useMemo } from 'react';

export function useTrailFilters(trails: Trail[]) {
    const [filters, setFilters] = useState<TrailFilters>(() => new TrailFilters({
        searchText: '',
        difficulty: [],
        minLength: 0,
        maxLength: null,
        minElevation: 0,
        maxElevation: null,
        maxTime: null,
        minRating: null
    }));

    const isActiveValue = (key: string, value: unknown) => {
        if (key === 'query') {
            return value !== '';
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== null;
    };

    const hasActiveFilters = Object.entries(filters).some(([key, value]) =>
        isActiveValue(key, value)
    );

    const filteredTrails = useMemo(() => {
        return trails.filter(filters.matches);
    }, [trails, filters]);

    return { filteredTrails, filters, setFilters,hasActiveFilters };
}