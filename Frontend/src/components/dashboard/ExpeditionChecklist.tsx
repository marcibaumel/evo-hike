import { CheckSquareIcon, TrashIcon, PlusIcon, PencilSimpleIcon } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export interface ChecklistItem {
    id: string;
    text: string;
    isCompleted: boolean;
}

interface ExpeditionChecklistProps {
    items: ChecklistItem[];
    title: string;
    subtitle?: string;
    onUpdate: (items: ChecklistItem[]) => void;
}

export const ExpeditionChecklist = ({ items, title, subtitle, onUpdate }: ExpeditionChecklistProps) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);

    const toggleItem = (id: string) => {
        onUpdate(items.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)));
    };

    const updateItemText = (id: string, text: string) => {
        onUpdate(items.map((item) => (item.id === id ? { ...item, text } : item)));
    };

    const deleteItem = (id: string) => {
        onUpdate(items.filter((item) => item.id !== id));
    };

    const addItem = () => {
        const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
            text: '',
            isCompleted: false
        };
        onUpdate([...items, newItem]);
    };

    return (
        <Card variant="glass">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-xl text-green-400">
                    <CheckSquareIcon size={24} weight="duotone" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white">{title}</h3>
                    {subtitle && <p className="text-xs text-brand-muted">{subtitle}</p>}
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-brand-muted hover:text-white"
                    title={isEditing ? t('common.done') : t('dashboard.checklist.edit_button')}>
                    {isEditing ? <CheckSquareIcon size={20} /> : <PencilSimpleIcon size={20} />}
                </button>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 group">
                        {!isEditing ? (
                            <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                                <div className="relative flex items-center justify-center w-5 h-5 border-2 border-brand-muted/40 rounded-md transition-colors group-hover:border-brand-accent">
                                    <input
                                        type="checkbox"
                                        checked={item.isCompleted}
                                        onChange={() => toggleItem(item.id)}
                                        className="peer appearance-none w-full h-full cursor-pointer"
                                    />
                                    <div className="absolute hidden peer-checked:block w-3 h-3 bg-brand-accent rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                </div>
                                <span
                                    className={`text-sm transition-colors ${
                                        item.isCompleted ? 'text-brand-muted' : 'text-white'
                                    }`}>
                                    {item.text}
                                </span>
                            </label>
                        ) : (
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => updateItemText(item.id, e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-brand-accent"
                                    placeholder={t('dashboard.checklist.item_placeholder', 'Item name...')}
                                    autoFocus={item.text === ''}
                                />
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors">
                                    <TrashIcon size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <Button
                    variant="secondary"
                    className="w-full mt-6 text-sm flex items-center justify-center gap-2"
                    onClick={addItem}>
                    <PlusIcon size={16} />
                    {t('dashboard.checklist.add_item', 'Add Item')}
                </Button>
            )}
        </Card>
    );
};
