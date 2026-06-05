import { MdLocationOn, MdFlag, MdDelete, MdAddLocation } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';

import type { ReactNode } from 'react';

interface MapNavigationControlsProps {
    onSelectStartMode: () => void;
    onSelectEndMode: () => void;
    onSelectWaypointMode: () => void;
    onClear: () => void;
    selectionMode: 'start' | 'end' | 'waypoint' | null;
}

interface ControlButtonProps {
    onClick: () => void;
    isActive: boolean;
    icon: ReactNode;
    label: string;
    colorClass: string;
    testName: string;
}

export default function MapNavigationControls({onSelectStartMode, onSelectEndMode, onSelectWaypointMode, onClear, selectionMode}: MapNavigationControlsProps) {
    const { t } = useTranslation();

    const ControlButton = ({ onClick, isActive, icon, label, colorClass, testName }: ControlButtonProps) => (
        <button
            onClick={onClick}
            title={label}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all border ${
                isActive
                    ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'bg-transparent border-transparent hover:bg-white/5'
            }`}
            data-testid={testName}
        >
            <div className={`text-2xl ${colorClass}`}>
                {icon}
            </div>
        </button>
    );

    return (
        <div className="absolute top-6 right-6 z-[500]">
            <Card variant="glass" className="p-1.5 flex flex-col gap-1.5 shadow-2xl">
                <ControlButton
                    onClick={onSelectStartMode}
                    isActive={selectionMode === 'start'}
                    icon={<MdLocationOn />}
                    colorClass="text-green-500"
                    label={t('routePage.navFrom')}
                    testName="btn-menuitem-nav-from"
                />
                <ControlButton
                    onClick={onSelectEndMode}
                    isActive={selectionMode === 'end'}
                    icon={<MdFlag />}
                    colorClass="text-red-500"
                    label={t('routePage.navTo')}
                    testName="btn-menuitem-nav-to"
                />
                <ControlButton
                    onClick={onSelectWaypointMode}
                    isActive={selectionMode === 'waypoint'}
                    icon={<MdAddLocation />}
                    colorClass="text-blue-500"
                    label={t('routePage.addWaypoint')}
                    testName="btn-menuitem-nav-addwaypoint"
                />

                <div className="h-px w-8 mx-auto bg-white/10 my-1" />

                <ControlButton
                    onClick={onClear}
                    isActive={false}
                    icon={<MdDelete />}
                    colorClass="text-gray-400 hover:text-red-400"
                    label={t('routePage.clearNav')}
                    testName="btn-menuitem-nav-clear"
                />
            </Card>
        </div>
    );
}