import type { Meta, StoryObj } from '@storybook/react';
import { CreatePostWidget } from './CreatePostWidget';
import '../../../i18n';

const meta: Meta<typeof CreatePostWidget> = {
    title: 'Components/SocialPage/CreatePostWidget',
    component: CreatePostWidget,
};
export default meta;

type Story = StoryObj<typeof CreatePostWidget>;

export const Default: Story = {};