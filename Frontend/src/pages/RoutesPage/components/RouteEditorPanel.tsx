import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import {
    PencilSimpleIcon,
    TimerIcon,
    RulerIcon,
    TextAlignLeftIcon,
    PlusIcon,
    XIcon,
    WarningCircleIcon,
    CaretLeftIcon,
    CaretRightIcon,
    UploadSimpleIcon
} from '@phosphor-icons/react';
import { useRouteForm } from '../../../hooks/useRouteForm';
import { useTranslation } from 'react-i18next';
import { parseGpxToGeoJSON, calculateDistanceInMeters, calculateElevationGain } from '../../../utils/routePlanner.ts';
import { Button } from '../../../components/Button';

interface RouteEditorPanelProps {
    name: string;
    description: string;
    distance: number;
    time: number;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSave: () => void;
    closeRouteEditor: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUploadedGpx: (data: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPoints: React.Dispatch<React.SetStateAction<any>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCustomRoute: React.Dispatch<React.SetStateAction<any>>;
    disableGpxUpload?: boolean;
    images: File[];
    onImagesChange: (files: File[] | ((prev: File[]) => File[])) => void;
    onReset: () => void;
}

export default function RouteEditorPanel({name, description, distance, time, onNameChange, onDescriptionChange, onSave, closeRouteEditor, setUploadedGpx, setCustomRoute, setPoints, disableGpxUpload, images, onImagesChange, onReset}: RouteEditorPanelProps) {
    const { t } = useTranslation();
    const { gpxInputRef, handleGpxChange, triggerGpxInput, gpxFile, clearGpx } = useRouteForm();
    const [showErrors, setShowErrors] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    const isFormValid = name.trim().length > 0 && description.trim().length > 0 && distance > 0;

    const handleResetClick = () => {
        if (window.confirm(t('routeForm.confirm_reset', 'Biztosan törölni szeretnél minden beírt adatot?'))) {
            onReset();
            clearGpx();
            setShowErrors(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h} ${t('routeForm.hours')} ${m} ${t('routeForm.minutes')}` : `${m} ${t('routeForm.minutes')}`;
    };

    useEffect(() => {
        if (gpxFile) {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let parsedGeojson: any = null;

                    if (gpxFile.name.toLowerCase().endsWith('.gpx')) {
                        parsedGeojson = parseGpxToGeoJSON(text);
                    } else {
                        try {
                            parsedGeojson = JSON.parse(text);
                        } catch {
                            parsedGeojson = null;
                        }
                    }

                    if (!parsedGeojson) {
                        setUploadedGpx(null);
                        return;
                    }

                    setUploadedGpx(parsedGeojson);

                    let rawCoords: number[][] = [];
                    if (parsedGeojson.type === 'Feature' && parsedGeojson.geometry?.type === 'LineString') {
                        rawCoords = parsedGeojson.geometry.coordinates;
                    } else if (parsedGeojson.type === 'FeatureCollection') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const lineStringFeature = parsedGeojson.features.find((f: any) => f.geometry?.type === 'LineString');
                        if (lineStringFeature) {
                            rawCoords = lineStringFeature.geometry.coordinates;
                        }
                    }

                    if (rawCoords.length > 0) {
                        const formattedCoords: [number, number][] = rawCoords.map(c => [c[1], c[0]]);

                        const calcDist = calculateDistanceInMeters(formattedCoords);
                        const gain = await calculateElevationGain(formattedCoords);
                        const walkingSpeedMetersPerSecond = 4000 / 3600;
                        const estimatedTimeSeconds = Math.round((calcDist / walkingSpeedMetersPerSecond) + (gain * 6));

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setCustomRoute((prev: any) => ({
                            ...prev,
                            distance: calcDist,
                            time: estimatedTimeSeconds,
                            elevationGain: gain,
                            coordinates: formattedCoords
                        }));

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setPoints((prev: any) => ({
                            ...prev,
                            start: formattedCoords[0],
                            end: formattedCoords[formattedCoords.length - 1]
                        }));
                    }
                }
            };
            reader.readAsText(gpxFile);
        } else {
            setUploadedGpx(null);
        }
    }, [gpxFile, setUploadedGpx, setCustomRoute, setPoints]);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) return alert(t('routeForm.image_too_big'));
            onImagesChange(prev => [...prev, file]);
            setTimeout(() => carouselRef.current?.scrollBy({ left: 120, behavior: 'smooth' }), 100);
        }
    };

    return (
        <div className="h-full flex flex-col bg-brand-dark overflow-y-auto custom-scrollbar">

            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-brand-dark/95 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-brand-accent/10 text-brand-accent">
                        <PencilSimpleIcon size={20} weight="fill" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-white">{t('routeForm.title')}</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleResetClick}
                        className="p-2 rounded-full hover:bg-red-500/10 text-brand-muted hover:text-red-400 transition-colors"
                        title={t('routeForm.reset_tooltip', 'Űrlap alaphelyzetbe állítása')}>
                        <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-lg border border-white/10 hover:border-red-500/30">
                            {t('routeForm.reset_btn', 'Alaphelyzet')}
                        </span>
                    </button>

                    <button onClick={closeRouteEditor} className="p-2 rounded-full hover:bg-white/5 text-brand-muted hover:text-white">
                        <XIcon size={20} />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-6 flex-1">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted flex items-center gap-2">
                        {t('routeForm.route_name')} {showErrors && !name && <WarningCircleIcon className="text-red-500" />}
                    </label>
                    <input
                        type="text" value={name} onChange={(e) => onNameChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-accent transition-colors outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-xs text-brand-muted flex items-center gap-1"><RulerIcon /> {t('routeForm.distance')}</span>
                        <div className="text-lg font-bold text-white">{(distance / 1000).toFixed(2)} km</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-xs text-brand-muted flex items-center gap-1"><TimerIcon /> {t('routeForm.time')}</span>
                        <div className="text-lg font-bold text-white">{formatTime(time)}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted flex items-center gap-2"><TextAlignLeftIcon /> {t('routeForm.description_label')}</label>
                    <textarea
                        value={description} onChange={(e) => onDescriptionChange(e.target.value)}
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white resize-none outline-none focus:border-brand-accent transition-colors"
                    />
                </div>

                {/* IMAGE CAROUSEL */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm text-brand-muted font-medium">
                        <span>{t('routeForm.image_alt')}</span>
                        <div className="flex gap-2">
                            <button onClick={() => carouselRef.current?.scrollBy({ left: -120, behavior: 'smooth' })} className="p-1 hover:text-white"><CaretLeftIcon /></button>
                            <button onClick={() => carouselRef.current?.scrollBy({ left: 120, behavior: 'smooth' })} className="p-1 hover:text-white"><CaretRightIcon /></button>
                        </div>
                    </div>
                    <div ref={carouselRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {images.map((img, idx) => (
                            <div key={idx} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden relative border border-white/10 snap-start">
                                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                                <button onClick={() => onImagesChange(p => p.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg text-white"><XIcon size={12} /></button>
                            </div>
                        ))}
                        <label className="shrink-0 w-24 h-24 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 text-brand-muted">
                            <PlusIcon size={24} /><input type="file" hidden onChange={handleUpload} accept="image/*" />
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                    <input type="file" ref={gpxInputRef} onChange={handleGpxChange} className="hidden" accept=".gpx,.geojson" />
                    <Button variant="secondary" className="w-full justify-between" onClick={disableGpxUpload ? undefined : triggerGpxInput}>
                        <span className="flex items-center gap-2"><UploadSimpleIcon /> {gpxFile ? gpxFile.name : t('routeForm.upload_file')}</span>
                        {gpxFile && <XIcon onClick={(e) => {
                            e.stopPropagation();
                            clearGpx();
                            setUploadedGpx(null);
                            setPoints({ start: null, end: null, mids: [] });
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setCustomRoute((prev: any) => ({
                                ...prev,
                                distance: 0,
                                time: 0,
                                elevationGain: 0,
                                coordinates: []
                            }));
                        }} />}
                    </Button>
                    <Button variant="primary" className="w-full py-4" onClick={() => isFormValid ? onSave() : setShowErrors(true)}>
                        <PlusIcon size={20} weight="bold" className="mr-2" /> {t('routeForm.add_route')}
                    </Button>
                </div>
            </div>
        </div>
    );
}