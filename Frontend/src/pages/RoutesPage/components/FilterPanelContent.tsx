import { FilterNumberInput } from './FilterNumberInput';
import { TrailFilters } from '../../../utils/filters';
import { ALL_DIFFICULTY_LEVELS, getDifficultyLabel, type DifficultyLevel } from '../../../utils/difficulty';
import { useTranslation } from 'react-i18next';

interface FilterPanelContentProps {
  filters: TrailFilters;
  update: (updatedFields: Partial<TrailFilters>) => void;
}

export const FilterPanelContent = ({ filters, update }: FilterPanelContentProps) => {
    const {t} =useTranslation();
    const toggleDifficulty = (level: DifficultyLevel) => {
        const already = filters.difficulty.includes(level);
        update({
            difficulty: already
                ? filters.difficulty.filter(d => d !== level)
                : [...filters.difficulty, level]
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-3">
                <label className="text-sm text-brand-muted uppercase tracking-wide block">{t("trail.difficulty_label")}</label>
                <div className="grid grid-cols-2 gap-2">
                    {ALL_DIFFICULTY_LEVELS.map(level => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => toggleDifficulty(level)}
                            className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                                filters.difficulty.includes(level)
                                    ? 'bg-brand-accent text-brand-dark border-brand-accent'
                                    : 'bg-white/5 text-brand-muted border-white/10 hover:border-white/20'
                            }`}
                        >
                            {getDifficultyLabel(level)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-sm text-brand-muted uppercase tracking-wide block">{t("trail.distance")} (km)</label>
                <div className="flex gap-3">
                    <FilterNumberInput
                        placeholder='Min'
                        value={filters.minLength}
                        onChange={(val) => update({ minLength: val })}
                    />
                    <FilterNumberInput
                        placeholder='Max'
                        value={filters.maxLength}
                        onChange={(val) => update({ maxLength: val })}
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-sm text-brand-muted uppercase tracking-wide block">{t("trail.elevation")} (m)</label>
                <div className="flex gap-3">
                    <FilterNumberInput
                        placeholder='Min'
                        value={filters.minElevation}
                        onChange={(val) => update({ minElevation: val })}
                    />
                    <FilterNumberInput
                        placeholder='Max'
                        value={filters.maxElevation}
                        onChange={(val) => update({ maxElevation: val })}
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-sm text-brand-muted uppercase tracking-wide block">{t("trail.time")} (min)</label>
                <FilterNumberInput
                    placeholder={t("trail.timePlaceholder")}
                    value={filters.maxTime}
                    onChange={(val) => update({ maxTime: val })}
                />
            </div>
            <div className="space-y-3">
                <label className="text-sm text-brand-muted uppercase tracking-wide block">{t("trail.rating")}</label>
                <div className="flex gap-2">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(star => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => update({ minRating: filters.minRating === star ? null : star })}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                                filters.minRating !== null && star <= filters.minRating
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
    );
};