import type { TrailFilters } from '../../../utils/filters';
import type { Dispatch, SetStateAction } from 'react';
import { XIcon } from '@phosphor-icons/react';
import type { DifficultyLevel } from '../../../utils/difficulty';

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
    0: 'Easy',
    1: 'Moderate',
    2: 'Hard',
    3: 'Expert'
};

interface FilterPanelProps {
    onClose: () => void
    filters: TrailFilters
    onFilterChange: Dispatch<SetStateAction<TrailFilters>>
}

export const FilterPanel = ({ onClose, filters, onFilterChange }: FilterPanelProps) => {
    const update = (patch: Partial<TrailFilters>) =>
        onFilterChange(prev => ({ ...prev, ...patch }));

    const toggleDifficulty = (level: DifficultyLevel) => {
        const already = filters.difficulty.includes(level);
        update({
            difficulty: already
                ? filters.difficulty.filter(d => d !== level)
                : [...filters.difficulty, level]
        });
    };

    const handleReset = () => {
        onFilterChange({
            query: filters.query, // keep the search term
            difficulty: [],
            minLength: null,
            maxLength: null,
            minElevation: null,
            maxElevation: null,
            maxTime: null,
            minRating: null
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-white font-semibold">Filter Trails</h2>
                <button onClick={onClose}>
                    <XIcon size={20} className="text-brand-muted" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Difficulty */}
                <div className="space-y-3">
                    <label className="text-sm text-brand-muted uppercase tracking-wide">Difficulty</label>
                    <div className="grid grid-cols-2 gap-2">
                        {([0, 1, 2, 3] as DifficultyLevel[]).map(level => (
                            <button
                                key={level}
                                onClick={() => toggleDifficulty(level)}
                                className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors
                                    ${filters.difficulty.includes(level)
                                ? 'bg-brand-accent text-brand-dark border-brand-accent'
                                : 'bg-white/5 text-brand-muted border-white/10 hover:border-white/20'
                            }`}
                            >
                                {DIFFICULTY_LABELS[level]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Length */}
                <div className="space-y-3">
                    <label className="text-sm text-brand-muted uppercase tracking-wide">Length (km)</label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minLength ?? ''}
                            onChange={e => update({ minLength: e.target.value ? Number(e.target.value) : null })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxLength ?? ''}
                            onChange={e => update({ maxLength: e.target.value ? Number(e.target.value) : null })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50"
                        />
                    </div>
                </div>

                {/* Elevation */}
                <div className="space-y-3">
                    <label className="text-sm text-brand-muted uppercase tracking-wide">Elevation Gain (m)</label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minElevation ?? ''}
                            onChange={e => update({ minElevation: e.target.value ? Number(e.target.value) : null })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxElevation ?? ''}
                            onChange={e => update({ maxElevation: e.target.value ? Number(e.target.value) : null })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50"
                        />
                    </div>
                </div>

                {/* Time */}
                <div className="space-y-3">
                    <label className="text-sm text-brand-muted uppercase tracking-wide">Max Time (min)</label>
                    <input
                        type="number"
                        placeholder="e.g. 120"
                        value={filters.maxTime ?? ''}
                        onChange={e => update({ maxTime: e.target.value ? Number(e.target.value) : null })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50"
                    />
                </div>

                {/* Rating */}
                <div className="space-y-3">
                    <label className="text-sm text-brand-muted uppercase tracking-wide">Min Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => update({ minRating: filters.minRating === star ? null : star })}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                                    ${filters.minRating !== null && star <= filters.minRating
                                ? 'bg-brand-accent text-brand-dark border-brand-accent'
                                : 'bg-white/5 text-brand-muted border-white/10 hover:border-white/20'
                            }`}
                            >
                                {star}★
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 flex gap-3">
                <button
                    onClick={handleReset}
                    className="flex-1 border border-white/10 text-brand-muted rounded-xl py-2.5 text-sm font-semibold hover:border-white/20 transition-colors">
                    Reset
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 bg-brand-accent text-brand-dark rounded-xl py-2.5 text-sm font-semibold">
                    Done
                </button>
            </div>
        </div>
    );
};