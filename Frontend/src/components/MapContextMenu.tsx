import React from 'react';
import { MapPinIcon, FlagIcon, TrashIcon, MapPinPlusIcon } from '@phosphor-icons/react';
import '../styles/RoutPageStyles.css';
import { useTranslation } from 'react-i18next';

// itt vannak a propsok amiket kapunk
interface MapContextMenuProps {
    x: number; // hol van vízszintesen
    y: number; // hol van függőlegesen
    onNavFrom: () => void; // ez fut le ha innen indulunk
    onNavTo: () => void; // ez fut le ha ide megyünk
    onAddWaypoint: () => void; // ha megállót akarunk
    onClearNav: () => void; // ha törölni akarunk mindent
}

// ez a menü ami felugrik
export default function MapContextMenu({ x, y, onNavFrom, onNavTo, onAddWaypoint, onClearNav }: MapContextMenuProps) {
    const { t } = useTranslation();
    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            action();
        }
    };

    return (
        <div
            className="map-context-menu"
            style={{ top: y, left: x }} // a pozíció dinamikus, ez marad inline
        >
            {/* start gomb zöld ikonnal */}
            <div
                className="context-menu-item"
                onClick={onNavFrom}
                onKeyDown={(e) => handleKeyDown(e, onNavFrom)}
                role="menuitem"
                tabIndex={0}>
                <MapPinIcon size={20} style={{ marginRight: '8px', color: '#5cb85c' }} /> {t('routePage.navFrom')}
            </div>
            {/* cél gomb piros zászlóval */}
            <div
                className="context-menu-item"
                onClick={onNavTo}
                onKeyDown={(e) => handleKeyDown(e, onNavTo)}
                role="menuitem"
                tabIndex={0}>
                <FlagIcon size={20} style={{ marginRight: '8px', color: '#d9534f' }} /> {t('routePage.navTo')}
            </div>
            {/* köztes pont narancs ikonnal */}
            <div
                className="context-menu-item"
                onClick={onAddWaypoint}
                onKeyDown={(e) => handleKeyDown(e, onAddWaypoint)}
                role="menuitem"
                tabIndex={0}>
                <MapPinPlusIcon size={20} style={{ marginRight: '8px', color: '#FF9800' }} />{' '}
                {t('routePage.addWaypoint')}
            </div>
            {/* törlés gomb szürke kukával */}
            <div
                className="context-menu-item"
                onClick={onClearNav}
                onKeyDown={(e) => handleKeyDown(e, onClearNav)}
                role="menuitem"
                tabIndex={0}>
                <TrashIcon size={20} style={{ marginRight: '8px', color: '#777' }} /> {t('routePage.clearNav')}
            </div>
        </div>
    );
}
