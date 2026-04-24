import React, { useState } from 'react';
import { MdWaterDrop, MdTerrain, MdPlace, MdMuseum, MdRestaurant, MdLocalDrink, MdVisibility, MdChurch, MdClose, MdLayers } from 'react-icons/md';
import { GiCastle, GiBrokenWall, GiCaveEntrance, GiWaterfall } from 'react-icons/gi';
import { useTranslation } from 'react-i18next';

export default function MapLegend() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const LegendItem = ({ icon, color, label }: { icon: React.ReactNode; color: string; label: string }) => (
        <div className="flex items-center gap-3 mb-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-xl shadow-inner border border-white/5" style={{ color: color }}>
                {icon}
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
        </div>
    );

    if (!isOpen) {
        return (
            <button
                className="absolute bottom-6 left-6 z-[500] bg-brand-dark/90 backdrop-blur-md border border-white/10 rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-white"
                onClick={() => setIsOpen(true)}
                title={t('mapLegend.title')}
            >
                <MdLayers size={28} />
            </button>
        );
    }

    return (
        <div className="absolute bottom-6 left-6 z-[500] bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-72 shadow-2xl animate-fadeIn max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <MdLayers className="text-brand-accent" /> {t('mapLegend.title')}
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-brand-muted hover:text-white transition-colors">
                    <MdClose size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Természeti dolgok */}
                <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-brand-muted tracking-[0.2em]">{t('mapLegend.natural')}</h4>
                    <LegendItem icon={<MdTerrain />} color="#8d6e63" label={t('mapLegend.peak')} />
                    <LegendItem icon={<MdWaterDrop />} color="#42a5f5" label={t('mapLegend.spring')} />
                    <LegendItem icon={<GiCaveEntrance />} color="#757575" label={t('mapLegend.cave')} />
                    <LegendItem icon={<GiWaterfall />} color="#26c6da" label={t('mapLegend.waterfall')} />
                </div>

                {/* Turista dolgok */}
                <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-brand-muted tracking-[0.2em]">{t('mapLegend.tourism')}</h4>
                    <LegendItem icon={<MdVisibility />} color="#ffa726" label={t('mapLegend.viewpoint')} />
                    <LegendItem icon={<MdPlace />} color="#ef5350" label={t('mapLegend.attraction')} />
                    <LegendItem icon={<MdMuseum />} color="#a1887f" label={t('mapLegend.museum')} />
                </div>

                {/* Történelmi cuccok */}
                <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-brand-muted tracking-[0.2em]">{t('mapLegend.historic')}</h4>
                    <LegendItem icon={<GiCastle />} color="#ab47bc" label={t('mapLegend.castle')} />
                    <LegendItem icon={<GiBrokenWall />} color="#bdbdbd" label={t('mapLegend.ruins')} />
                    <LegendItem icon={<MdChurch />} color="#78909c" label={t('mapLegend.monument')} />
                </div>

                {/* Szolgáltatások */}
                <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-brand-muted tracking-[0.2em]">{t('mapLegend.service')}</h4>
                    <LegendItem icon={<MdLocalDrink />} color="#29b6f6" label={t('mapLegend.drinking_water')} />
                    <LegendItem icon={<MdChurch />} color="#7e57c2" label={t('mapLegend.church')} />
                    <LegendItem icon={<MdRestaurant />} color="#ec407a" label={t('mapLegend.restaurant')} />
                </div>
            </div>
        </div>
    );
}