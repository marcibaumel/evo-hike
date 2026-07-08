import { Trail } from '../../../utils/Trail';
import type { OverpassElement } from '../../../api/overpassApi';
import { MapPinIcon, CameraIcon, MapTrifoldIcon,XIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import {Map} from 'leaflet';

interface SelectedTrailDetailsProps {
    trail: Trail;
    pois: OverpassElement[];
    map: Map | null;
    onClose: () => void
}

export default function SelectedTrailDetails({ trail, pois, map,onClose }: SelectedTrailDetailsProps) {
    const { t } = useTranslation();
    const h = Math.floor(trail.time / 60);
    const m = Math.round(trail.time % 60);
    const duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
    return (
        <div className="bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <button
                onClick={onClose}
                className="p-2 rounded-full text-brand-muted hover:text-white hover:bg-white/10 transition-colors"
            >
                <XIcon size={20} />
            </button>
            <h2 className="flex items-center text-xl font-display font-bold text-white">
                <MapPinIcon className="text-red-500 mr-2" size={28} weight="fill" /> {trail.name}
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300 border-b border-white/10 pb-4">
                <span><strong>{t('selectedTrail.distance')}:</strong> {(trail.length / 1000).toFixed(1)} km</span>
                <span><strong>{t('selectedTrail.elevation')}:</strong> {trail.elevationGain}m</span>
                <span><strong>{t('selectedTrail.time')}:</strong>{duration}</span>
            </div>

            <p className="text-sm text-brand-muted italic leading-relaxed">{trail.description}</p>

            {trail.userPhotos?.length > 0 && (
                <div className="space-y-3 pt-2">
                    <h3 className="flex items-center text-sm font-bold text-white uppercase tracking-wider"><CameraIcon className="mr-2" /> {t('selectedTrail.user_photos')}</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {trail.userPhotos.map((url, idx) => (
                            <img key={idx} src={url} className="h-24 w-32 object-cover rounded-xl border border-white/10 snap-start shrink-0" alt="" />
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
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}