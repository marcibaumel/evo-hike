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

const PREMADE_ICONS = {
    terrain: createReactIcon(<MdTerrain />, '#795548'),
    water: createReactIcon(<MdWaterDrop />, '#3b82f6'),
    cave: createReactIcon(<GiCaveEntrance />, '#4b5563'),
    waterfall: createReactIcon(<GiWaterfall />, '#06b6d4'),
    viewpoint: createReactIcon(<MdVisibility />, '#f97316'),
    attraction: createReactIcon(<MdPlace />, '#ef4444'),
    museum: createReactIcon(<MdMuseum />, '#8b5cf6'),
    castle: createReactIcon(<GiCastle />, '#d946ef'),
    ruins: createReactIcon(<GiBrokenWall />, '#9ca3af'),
    church: createReactIcon(<MdChurch />, '#64748b'),
    drink: createReactIcon(<MdLocalDrink />, '#0ea5e9'),
    restaurant: createReactIcon(<MdRestaurant />, '#f43f5e'),
    park: createReactIcon(<MdPark />, '#22c55e'),
    historicDefault: createReactIcon(<MdMuseum />, '#795548'),
    tourismDefault: createReactIcon(<MdPlace />, '#eab308'),
    default: createReactIcon(<MdPlace />, '#3b82f6')
};

const TAG_TO_ICON: Record<string, L.DivIcon> = {
    'natural=peak': PREMADE_ICONS.terrain,
    'natural=saddle': PREMADE_ICONS.terrain,
    'natural=spring': PREMADE_ICONS.water,
    'natural=cave_entrance': PREMADE_ICONS.cave,
    'natural=waterfall': PREMADE_ICONS.waterfall,
    'waterway=waterfall': PREMADE_ICONS.waterfall,
    'tourism=viewpoint': PREMADE_ICONS.viewpoint,
    'tourism=attraction': PREMADE_ICONS.attraction,
    'tourism=museum': PREMADE_ICONS.museum,
    'historic=castle': PREMADE_ICONS.castle,
    'historic=ruins': PREMADE_ICONS.ruins,
    'historic=memorial': PREMADE_ICONS.church,
    'historic=monument': PREMADE_ICONS.church,
    'amenity=drinking_water': PREMADE_ICONS.drink,
    'amenity=place_of_worship': PREMADE_ICONS.church,
    'amenity=restaurant': PREMADE_ICONS.restaurant
};

const iconCache: Record<number, L.DivIcon> = {};

export const getIconForPoi = (poi: OverpassElement): L.DivIcon => {
    if (!poi || !poi.id || !poi.tags) {
        return PREMADE_ICONS.default;
    }
    if (iconCache[poi.id]) {
        return iconCache[poi.id];
    }
    const tags = poi.tags;
    let finalIcon = PREMADE_ICONS.default;

    const keysToCheck = ['natural', 'waterway', 'tourism', 'historic', 'amenity'];
    for (let i = 0; i < keysToCheck.length; i++) {
        const key = keysToCheck[i];
        const value = tags[key];

        if (value) {
            const mapKey = key + '=' + value;
            const foundIcon = TAG_TO_ICON[mapKey];

            if (foundIcon) {
                finalIcon = foundIcon;
                break;
            }
        }
    }

    if (finalIcon === PREMADE_ICONS.default) {
        if (tags.natural) finalIcon = PREMADE_ICONS.park;
        else if (tags.historic) finalIcon = PREMADE_ICONS.historicDefault;
        else if (tags.tourism) finalIcon = PREMADE_ICONS.tourismDefault;
    }

    iconCache[poi.id] = finalIcon;

    return finalIcon;
};