import type { DifficultyLevel } from "./difficulty"

export type TrailFilters = {
    query: string
    difficulty: DifficultyLevel[]
    minLength: number | null
    maxLength: number | null
    minElevation: number | null
    maxElevation: number | null
    maxTime: number | null
    minRating: number | null
}