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

export const getIconForPoi = (poi: OverpassElement) => {
    const tags = poi.tags || {};

    if (tags.natural === 'peak' || tags.natural === 'saddle')
        return createReactIcon(<MdTerrain />, '#795548');
    if (tags.natural === 'spring')
        return createReactIcon(<MdWaterDrop />, '#3b82f6');
    if (tags.natural === 'cave_entrance')
        return createReactIcon(<GiCaveEntrance />, '#4b5563');
    if (tags.waterway === 'waterfall' || tags.natural === 'waterfall')
        return createReactIcon(<GiWaterfall />, '#06b6d4');

    if (tags.tourism === 'viewpoint')
        return createReactIcon(<MdVisibility />, '#f97316');
    if (tags.tourism === 'attraction')
        return createReactIcon(<MdPlace />, '#ef4444');
    if (tags.tourism === 'museum')
        return createReactIcon(<MdMuseum />, '#8b5cf6');

    if (tags.historic === 'castle')
        return createReactIcon(<GiCastle />, '#d946ef');
    if (tags.historic === 'ruins')
        return createReactIcon(<GiBrokenWall />, '#9ca3af');
    if (tags.historic === 'memorial' || tags.historic === 'monument')
        return createReactIcon(<MdChurch />, '#64748b');

    if (tags.amenity === 'drinking_water')
        return createReactIcon(<MdLocalDrink />, '#0ea5e9');
    if (tags.amenity === 'place_of_worship')
        return createReactIcon(<MdChurch />, '#8b5cf6');
    if (tags.amenity === 'restaurant')
        return createReactIcon(<MdRestaurant />, '#f43f5e');


    if (tags.natural) return createReactIcon(<MdPark />, '#22c55e');
    if (tags.historic) return createReactIcon(<MdMuseum />, '#795548');
    if (tags.tourism) return createReactIcon(<MdPlace />, '#eab308');

    return createReactIcon(<MdPlace />, '#3b82f6');
};