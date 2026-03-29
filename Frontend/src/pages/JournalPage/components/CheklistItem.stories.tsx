import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChecklistItemComponent } from './ChecklistItem';
import '../../../i18n';

const meta: Meta<typeof ChecklistItemComponent> = {
    title: 'Components/JournalPage/ChecklistItem',
    component: ChecklistItemComponent
};
export default meta;

type Story = StoryObj<typeof ChecklistItemComponent>;

export const Unchecked: Story = {
    args: {
        item: { id: '1', text: 'Hiking boots', isCompleted: false },
        isEditing: false,
        onToggle: (id) => console.log('Toggled:', id),
        onUpdateText: (id, text) => console.log('Updated:', id, text),
        onDelete: (id) => console.log('Deleted:', id)
    }
};

export const Checked: Story = {
    args: {
        item: { id: '2', text: 'Water bottle', isCompleted: true },
        isEditing: false,
        onToggle: (id) => console.log('Toggled:', id),
        onUpdateText: (id, text) => console.log('Updated:', id, text),
        onDelete: (id) => console.log('Deleted:', id)
    }
};

export const Editing: Story = {
    args: {
        item: { id: '3', text: 'Trail map', isCompleted: false },
        isEditing: true,
        onToggle: (id) => console.log('Toggled:', id),
        onUpdateText: (id, text) => console.log('Updated:', id, text),
        onDelete: (id) => console.log('Deleted:', id)
    }
};