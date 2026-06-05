import { divIcon, point } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import {
    MdWaterDrop, MdTerrain, MdPlace, MdMuseum,
    MdRestaurant, MdLocalDrink, MdVisibility, MdPark,
    MdChurch, MdLocationOn, MdFlag
} from 'react-icons/md';
import {
    GiCastle, GiBrokenWall, GiCaveEntrance, GiWaterfall
} from 'react-icons/gi';
import type { OverpassElement } from '../api/overpassApi';

interface Cluster {
    getChildCount: () => number;
}

export const createClusterCustomIcon = (cluster: Cluster) => {
    return divIcon({
        html: `<div class="flex items-center justify-center w-9 h-9 bg-brand-accent text-brand-dark font-extrabold text-sm rounded-full border-[3px] border-white/90 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110">
                ${cluster.getChildCount()}
               </div>`,
        className: 'bg-transparent border-none',
        iconSize: point(36, 36, true)
    });
};

const createReactIcon = (icon: React.ReactElement, bgColor: string, isSmall = false) => {
    const size = isSmall ? 'w-6 h-6 text-[14px]' : 'w-8 h-8 text-[18px]';
    const anchorSize = isSmall ? 24 : 32;

    const iconHtml = renderToStaticMarkup(
        <div
            className={`flex items-center justify-center ${size} rounded-full border-2 border-white/80 shadow-[0_3px_10px_rgba(0,0,0,0.5)] text-white backdrop-blur-sm`}
            style={{ backgroundColor: bgColor }}
        >
            {icon}
        </div>
    );

    return divIcon({
        html: iconHtml,
        className: 'bg-transparent border-none',
        iconSize: point(anchorSize, anchorSize, true),
        iconAnchor: [anchorSize / 2, anchorSize],
        popupAnchor: [0, -anchorSize]
    });
};

export const startIcon = createReactIcon(<MdLocationOn />, '#22c55e', true);
export const endIcon = createReactIcon(<MdFlag />, '#ef4444', true);
export const waypointIcon = createReactIcon(<MdPlace />, '#3b82f6', true);

const ICON_RECIPES: Record<string, { icon: React.ReactElement, color: string }> = {
    'natural=peak': { icon: <MdTerrain />, color: '#795548' },
    'natural=saddle': { icon: <MdTerrain />, color: '#795548' },
    'natural=spring': { icon: <MdWaterDrop />, color: '#3b82f6' },
    'natural=cave_entrance': { icon: <GiCaveEntrance />, color: '#4b5563' },
    'natural=waterfall': { icon: <GiWaterfall />, color: '#06b6d4' },
    'waterway=waterfall': { icon: <GiWaterfall />, color: '#06b6d4' },
    'tourism=viewpoint': { icon: <MdVisibility />, color: '#f97316' },
    'tourism=attraction': { icon: <MdPlace />, color: '#ef4444' },
    'tourism=museum': { icon: <MdMuseum />, color: '#8b5cf6' },
    'historic=castle': { icon: <GiCastle />, color: '#d946ef' },
    'historic=ruins': { icon: <GiBrokenWall />, color: '#9ca3af' },
    'historic=memorial': { icon: <MdChurch />, color: '#64748b' },
    'historic=monument': { icon: <MdChurch />, color: '#64748b' },
    'amenity=drinking_water': { icon: <MdLocalDrink />, color: '#0ea5e9' },
    'amenity=place_of_worship': { icon: <MdChurch />, color: '#8b5cf6' },
    'amenity=restaurant': { icon: <MdRestaurant />, color: '#f43f5e' }
};

const iconCache: Record<string | number, L.DivIcon> = {};

export const getIconForPoi = (poi: OverpassElement): L.DivIcon => {
    const poiId = poi?.id || `fallback-${Math.random()}`;

    if (iconCache[poiId]) {
        return iconCache[poiId];
    }
    const tags = poi?.tags || {};
    let finalIcon: L.DivIcon | null = null;

    const keysToCheck = ['natural', 'waterway', 'tourism', 'historic', 'amenity'];

    for (let i = 0; i < keysToCheck.length; i++) {
        const key = keysToCheck[i];
        const value = tags[key];

        if (value) {
            const mapKey = key + '=' + value;
            const recipe = ICON_RECIPES[mapKey];

            if (recipe) {
                finalIcon = createReactIcon(recipe.icon, recipe.color);
                break;
            }
        }
    }

    if (!finalIcon) {
        if (tags.natural) finalIcon = createReactIcon(<MdPark />, '#22c55e');
        else if (tags.historic) finalIcon = createReactIcon(<MdMuseum />, '#795548');
        else if (tags.tourism) finalIcon = createReactIcon(<MdPlace />, '#eab308');
        else finalIcon = createReactIcon(<MdPlace />, '#3b82f6');
    }

    iconCache[poiId] = finalIcon;

    return finalIcon;
};