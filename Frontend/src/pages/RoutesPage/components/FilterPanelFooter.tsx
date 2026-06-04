import { useTranslation } from 'react-i18next';
import { TrailFilters } from '../../../utils/filters';
import type { Dispatch, SetStateAction } from 'react';

interface FilterPanelFooterProps{
    onFilterChange: Dispatch<SetStateAction<TrailFilters>>
    filters: TrailFilters;
    onClose:  () => void
}

export const FilterPanelFooter = ({onClose,onFilterChange,filters}:FilterPanelFooterProps)=>{
    const{t} = useTranslation();
    const handleReset = () => {
        onFilterChange(new TrailFilters({
            searchText: filters.searchText,
            difficulty: [],
            minLength: 0,
            maxLength: null,
            minElevation: null,
            maxElevation: null,
            maxTime: null,
            minRating: null
        }));
    };

    return (
        <div className="p-6 border-t border-white/5 flex gap-3">
            <button
                onClick={handleReset}
                className="flex-1 border border-white/10 text-brand-muted rounded-xl py-2.5 text-sm font-semibold hover:border-white/20 transition-colors">
                    {t("filterPage.reset")}
            </button>
            <button
                onClick={onClose}
                className="flex-1 bg-brand-accent text-brand-dark rounded-xl py-2.5 text-sm font-semibold">
                     {t("filterPage.done")}
            </button>
        </div>
    );
};