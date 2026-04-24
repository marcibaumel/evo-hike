import { Trail } from '../../../utils/Trail';
import type { OverpassElement } from '../../../api/overpassApi';
import { MapPinIcon, CameraIcon, MapTrifoldIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface SelectedTrailDetailsProps {
    trail: Trail;
    pois: OverpassElement[];
    map: any;
}

export default function SelectedTrailDetails({ trail, pois, map }: SelectedTrailDetailsProps) {
    const { t } = useTranslation();
    return (
        <div className="bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="flex items-center text-xl font-display font-bold text-white">
                <MapPinIcon className="text-red-500 mr-2" size={28} weight="fill" /> {trail.name}
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300 border-b border-white/10 pb-4">
                <span><strong>{t('selectedTrail.distance')}:</strong> {(trail.length / 1000).toFixed(1)} km</span>
                <span><strong>{t('selectedTrail.elevation')}:</strong> {trail.elevationGain}m</span>
                <span><strong>{t('selectedTrail.time')}:</strong> {Math.floor(trail.time / 60)}h {trail.time % 60}m</span>
            </div>

            <p className="text-sm text-brand-muted italic leading-relaxed">{trail.description}</p>

            {trail.userPhotos?.length > 0 && (
                <div className="space-y-3 pt-2">
                    <h3 className="flex items-center text-sm font-bold text-white uppercase tracking-wider"><CameraIcon className="mr-2" /> {t('selectedTrail.user_photos')}</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {trail.userPhotos.map((url, idx) => (
                            <img key={idx} src={url} className="h-24 w-32 object-cover rounded-xl border border-white/10 snap-start shrink-0" />
                        ))}
                    </div>
                </div>
            )}

            {pois.length > 0 && (
                <div className="space-y-3 pt-2">
                    <h3 className="flex items-center text-sm font-bold text-white uppercase tracking-wider"><MapTrifoldIcon className="text-brand-accent mr-2" /> {t('selectedTrail.nearby_pois')} ({pois.length})</h3>
                    <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                        {pois.map((poi) => (
                            <li key={poi.id}>
                                <button
                                    onClick={() => map?.flyTo([poi.lat, poi.lon], 18, { animate: true, duration: 1.5 })}
                                    className="text-left group w-full"
                                >
                                    <span className="text-brand-accent group-hover:underline font-bold text-sm">{poi.tags?.name}</span>
                                    <span className="text-brand-muted text-xs block">({poi.tags?.tourism || poi.tags?.natural || 'POI'})</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}