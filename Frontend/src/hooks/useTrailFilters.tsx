import type { DifficultyLevel } from "../utils/difficulty"
import { Trail } from "../utils/Trail"
import { useState,useMemo } from "react"

export function useTrailFilters(trails: Trail[]) {
    const [filters, setFilters] = useState({
        query: '',
        difficulty: [] as DifficultyLevel[],
        minLength: null as number | null,
        maxLength: null as number | null,
        minElevation: null as number | null,
        maxElevation: null as number | null,
        maxTime: null as number | null,
        minRating: null as number | null,
    })

    const filteredTrails = useMemo(() => trails.filter(trail => {
        if (filters.query && !trail.name.toLowerCase().includes(filters.query.toLowerCase())
            && !trail.location.toLowerCase().includes(filters.query.toLowerCase())) return false

        if (filters.difficulty.length > 0 && !filters.difficulty.includes(trail.difficulty)) return false

        if (filters.minLength !== null && trail.length < filters.minLength * 1000) return false
        if (filters.maxLength !== null && trail.length > filters.maxLength * 1000) return false

        if (filters.minElevation !== null && trail.elevationGain < filters.minElevation) return false
        if (filters.maxElevation !== null && trail.elevationGain > filters.maxElevation) return false

        if (filters.maxTime !== null && trail.time > filters.maxTime) return false

        if (filters.minRating !== null && trail.rating < filters.minRating) return false

        return true
    }), [trails, filters])

    return { filteredTrails, filters, setFilters }
}