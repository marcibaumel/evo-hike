import {TrailFilters} from '../../../utils/filters';
import type { Dispatch, SetStateAction } from 'react';
import { FilterPanelContent } from './FilterPanelContent';
import { FilterPanelHeader } from './FilterPanelHeader';
import { FilterPanelFooter } from './FilterPanelFooter';


interface FilterPanelProps {
    onClose: () => void
    filters: TrailFilters
    onFilterChange: Dispatch<SetStateAction<TrailFilters>>
}

export const FilterPanel = ({ onClose, filters, onFilterChange }: FilterPanelProps) => {
    const update = (patch: Partial<TrailFilters>) =>
        onFilterChange(prev => {
            const nextFilter = prev.clone();
            return Object.assign(nextFilter,patch);
        }
        );

    return (
        <div className="flex flex-col h-full">
            <FilterPanelHeader onClose={onClose} />
            <FilterPanelContent filters={filters} update={update}/>
            <FilterPanelFooter onClose={onClose} onFilterChange={onFilterChange} filters={filters}/>
        </div>
    );
};