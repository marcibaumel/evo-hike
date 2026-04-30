import { CheckSquareIcon, PlusIcon, PencilSimpleIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { ChecklistItemComponent } from './ChecklistItem';
import type { ChecklistItem } from './ChecklistItem';
export type { ChecklistItem } from './ChecklistItem';

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
                    <ChecklistItemComponent
                        key={item.id}
                        item={item}
                        isEditing={isEditing}
                        onToggle={toggleItem}
                        onUpdateText={updateItemText}
                        onDelete={deleteItem}
                    />
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