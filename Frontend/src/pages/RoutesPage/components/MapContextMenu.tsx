import React from 'react';
import { MdLocationOn, MdFlag, MdDelete, MdAddLocation } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

interface MapContextMenuProps {
    x: number;
    y: number;
    onNavFrom: () => void;
    onNavTo: () => void;
    onAddWaypoint: () => void;
    onClearNav: () => void;
}

export default function MapContextMenu({
                                           x,
                                           y,
                                           onNavFrom,
                                           onNavTo,
                                           onAddWaypoint,
                                           onClearNav,
                                       }: MapContextMenuProps) {
    const { t } = useTranslation();
    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            action();
        }
    };

    return (
        <div
            className="fixed z-[10000] bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-2 min-w-[180px]"
            style={{ top: y, left: x }}
        >
            <div
                className="flex items-center px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/10 text-sm text-gray-200"
                onClick={onNavFrom}
                onKeyDown={(e) => handleKeyDown(e, onNavFrom)}
                role="menuitem"
                tabIndex={0}>
                <MdLocationOn className="mr-2 text-green-500 text-lg" />
                {t('routePage.navFrom')}
            </div>
            <div
                className="flex items-center px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/10 text-sm text-gray-200"
                onClick={onNavTo}
                onKeyDown={(e) => handleKeyDown(e, onNavTo)}
                role="menuitem"
                tabIndex={0}>
                <MdFlag className="mr-2 text-red-500 text-lg" />
                {t('routePage.navTo')}
            </div>
            <div
                className="flex items-center px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/10 text-sm text-gray-200"
                onClick={onAddWaypoint}
                onKeyDown={(e) => handleKeyDown(e, onAddWaypoint)}
                role="menuitem"
                tabIndex={0}>
                <MdAddLocation className="mr-2 text-blue-500 text-lg" />
                {t('routePage.addWaypoint')}
            </div>
            <div className="h-px bg-white/10 my-1"></div>
            <div
                className="flex items-center px-4 py-2.5 cursor-pointer transition-colors hover:bg-red-500/20 hover:text-red-400 text-sm text-gray-400"
                onClick={onClearNav}
                onKeyDown={(e) => handleKeyDown(e, onClearNav)}
                role="menuitem"
                tabIndex={0}>
                <MdDelete className="mr-2 text-lg" />
                {t('routePage.clearNav')}
            </div>
        </div>
    );
}