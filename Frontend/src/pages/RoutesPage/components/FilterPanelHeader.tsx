import { XIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface FilterPanelContentProps {
  onClose:  () => void
}

export const FilterPanelHeader = ({onClose}:FilterPanelContentProps)=>{
    const {t} = useTranslation();
    return (
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-semibold">{t("filterPage.filterTrails")}</h2>
            <button onClick={onClose}>
                <XIcon size={20} className="text-brand-muted" />
            </button>
        </div>
    );
};