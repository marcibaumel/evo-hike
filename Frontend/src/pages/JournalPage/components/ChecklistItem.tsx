import { TrashIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

export interface ChecklistItem {
    id: string;
    text: string;
    isCompleted: boolean;
}

interface ChecklistItemProps {
    item: ChecklistItem;
    isEditing: boolean;
    onToggle: (id: string) => void;
    onUpdateText: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}

export const ChecklistItemComponent = ({ item, isEditing, onToggle, onUpdateText, onDelete }: ChecklistItemProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-3 group">
            {!isEditing ? (
                <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-brand-muted/40 rounded-md transition-colors group-hover:border-brand-accent">
                        <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => onToggle(item.id)}
                            className="peer appearance-none w-full h-full cursor-pointer"
                        />
                        <div className="absolute hidden peer-checked:block w-3 h-3 bg-brand-accent rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <span className={`text-sm transition-colors ${item.isCompleted ? 'text-brand-muted' : 'text-white'}`}>
                        {item.text}
                    </span>
                </label>
            ) : (
                <div className="flex items-center gap-2 flex-1">
                    <input
                        type="text"
                        value={item.text}
                        onChange={(e) => onUpdateText(item.id, e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-brand-accent"
                        placeholder={t('dashboard.checklist.item_placeholder', 'Item name...')}
                        autoFocus={item.text === ''}
                    />
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors">
                        <TrashIcon size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};