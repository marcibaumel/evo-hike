import { XIcon } from '@phosphor-icons/react';

interface FilterPanelContentProps {
  onClose:  () => void
}

export const FilterPanelHeader = ({onClose}:FilterPanelContentProps)=>{
    return (
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-semibold">Filter Trails</h2>
            <button onClick={onClose}>
                <XIcon size={20} className="text-brand-muted" />
            </button>
        </div>
    );
};