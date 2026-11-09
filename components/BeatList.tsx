import React, { useState, useRef } from 'react';
import { Play, Pause, Image as ImageIcon, Instagram, ChevronDown, Check, X } from './Icons';
import { BEATS_15, LICENSES, ASSETS, BeatItem, copyAndNotifyDM } from '../constants';

type FilterType = 'Todos' | 'Oscuro' | 'Chill' | 'Nostálgico';

const WAVEFORM_BARS = [45, 75, 35, 90, 60, 100, 75, 45, 85, 95, 55, 40, 80, 100, 65, 85, 40, 60, 90, 50];

export const BeatList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const [expandedBeatId, setExpandedBeatId] = useState<string | null>(null);
  const [playingBeatId, setPlayingBeatId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, { current: number; duration: number }>>({});
  const [selectedLicenses, setSelectedLicenses] = useState<Record<string, string>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const toggleExpand = (id: string) => {
    setExpandedBeatId(prev => (prev === id ? null : id));
  };

  const handlePlay = (id: string) => {
    setPlayingBeatId(id);
    // Solo un audio puede sonar a la vez: al pulsar uno, los demás se pausan.
    (Object.entries(audioRefs.current) as [string, HTMLAudioElement | null][]).forEach(([beatId, el]) => {
      if (beatId !== id && el && !el.paused) {
        el.pause();
      }
    });
  };

  const handlePause = (id: string) => {
    setPlayingBeatId(prev => prev === id ? null : prev);
  };

  const handleEnded = (id: string) => {
    setPlayingBeatId(prev => prev === id ? null : prev);
  };

  const togglePlay = (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playingBeatId === id && !audio.paused) {
      audio.pause();
      setPlayingBeatId(null);
    } else {
      // Pausar cualquier otro audio activo
      (Object.entries(audioRefs.current) as [string, HTMLAudioElement | null][]).forEach(([otherId, otherEl]) => {
        if (otherId !== id && otherEl && !otherEl.paused) {
          otherEl.pause();
        }
      });
      audio.play().catch(() => {});
      setPlayingBeatId(id);
    }
  };

  const handleTimeUpdate = (id: string, e: React.SyntheticEvent<HTMLAudioElement>) => {
    const target = e.currentTarget;
    if (!target.duration) return;
    setAudioProgress(prev => ({
      ...prev,
      [id]: {
        current: target.currentTime,
        duration: target.duration
      }
    }));
  };

  const handleSeek = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[id];
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = newPercent * audio.duration;
    setAudioProgress(prev => ({
      ...prev,
      [id]: {
        current: audio.currentTime,
        duration: audio.duration
      }
    }));
  };

  const formatTime = (seconds?: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Ajusta la frecuencia de oscilación del ecualizador al BPM musical del beat
  const getBeatDurations = (bpmStr: string) => {
    const bpmNum = parseInt(bpmStr, 10) || 95;
    const beatSec = 60 / bpmNum;
    return {
      d1: `${(beatSec * 0.85).toFixed(3)}s`,
      d2: `${(beatSec * 0.55).toFixed(3)}s`,
      d3: `${(beatSec * 1.05).toFixed(3)}s`,
      d4: `${(beatSec * 0.70).toFixed(3)}s`,
      d5: `${(beatSec * 0.90).toFixed(3)}s`,
    };
  };

  const filteredBeats = BEATS_15.filter((beat) => {
    if (activeFilter === 'Todos') return true;
    return beat.mood === activeFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2">
      
      {/* 4 Filtros encima del catálogo: Todos, Oscuro, Chill, Nostálgico */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
        {(['Todos', 'Oscuro', 'Chill', 'Nostálgico'] as FilterType[]).map((filter) => {
          const isActive = activeFilter === filter;
          const count = filter === 'Todos' 
            ? BEATS_15.length 
            : BEATS_15.filter(b => b.mood === filter).length;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-[0.2em] font-rubik transition-all duration-300 flex items-center gap-2 select-none ${
                isActive
                  ? 'bg-red-600 text-white border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.55)] scale-105'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <span>{filter}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-black/40 text-white' : 'bg-neutral-900 text-neutral-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista en LÍNEA (Horizontal Row / Tracklist format) con mayor grosor y presencia visual */}
      <div className="space-y-4 sm:space-y-5">
        {filteredBeats.map((beat: BeatItem) => {
          const isExpanded = expandedBeatId === beat.id;
          const isPlaying = playingBeatId === beat.id;
          const beatEqDuration = getBeatDurations(beat.bpm);
          const prog = audioProgress[beat.id] || { current: 0, duration: 0 };
          const selectedLicId = selectedLicenses[beat.id];
          const selectedLic = LICENSES.find(l => l.id === selectedLicId);
          const dmText = selectedLic
            ? `Hola, quiero licencia ${selectedLic.name.toUpperCase()}, de ${beat.title}.`
            : (beat.hasExclusive
                ? `Hola, me interesa la licencia para ${beat.title}`
                : `Hola, me interesa la licencia (Esencial, Premium o Stems) para ${beat.title}`);

          return (
            <div
              key={beat.id}
              className={`group rounded-2xl border transition-all duration-500 overflow-hidden relative bg-black ${
                isPlaying
                  ? 'border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.6)] ring-2 ring-red-500'
                  : isExpanded
                    ? 'border-red-500/80 ring-1 ring-red-500/50 shadow-[0_0_35px_rgba(220,38,38,0.35)]'
                    : 'border-neutral-900 hover:border-red-500 hover:shadow-[0_0_45px_rgba(220,38,38,0.5)]'
              }`}
            >
              {/* Indicador lateral luminoso continuo cuando está sonando */}
              {isPlaying && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600 shadow-[0_0_18px_rgba(239,68,68,1)] z-20" />
              )}

              {/* Fondo de portada: Tenue/oscuro en reposo e ILUMINADO de forma vibrante al pasar la flecha (hover) */}
              {beat.coverUrl && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
                  <div
                    className={`absolute -inset-6 bg-no-repeat transition-all duration-500 ease-out will-change-transform ${
                      isPlaying 
                        ? 'opacity-100 animate-bpm-pulse scale-105 filter brightness-125 contrast-125 saturate-125' 
                        : isExpanded
                          ? 'opacity-90 scale-102 filter brightness-115 contrast-120 saturate-115'
                          : 'opacity-20 group-hover:opacity-95 group-hover:scale-105 group-hover:brightness-125 group-hover:contrast-120 group-hover:saturate-120 animate-cinematic-pan'
                    }`}
                    style={{
                      backgroundImage: `url(${beat.coverUrl})`,
                      backgroundPosition: beat.bgPosition || 'center center',
                      backgroundSize: beat.bgSize || '135%',
                      ...(isPlaying ? { animationDuration: beatEqDuration.d3 } : {})
                    }}
                  />

                  {/* Gradiente dinámico: Oscurecido en reposo para quitar luz, y despejado en hover para iluminarse */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-black/45 via-black/10 to-black/45 opacity-80' 
                      : 'bg-gradient-to-r from-black/85 via-black/60 to-black/85 group-hover:from-black/45 group-hover:via-black/15 group-hover:to-black/45'
                  }`} />
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    isPlaying 
                      ? 'bg-gradient-to-b from-black/30 via-transparent to-black/40 opacity-70' 
                      : 'bg-gradient-to-b from-black/70 via-black/40 to-black/75 group-hover:from-black/35 group-hover:via-transparent group-hover:to-black/45'
                  }`} />

                  {/* Resplandor carmesí ambiental que se enciende en hover o reproducción */}
                  <div className={`absolute inset-0 bg-red-600/10 mix-blend-screen pointer-events-none transition-opacity duration-500 ${
                    isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'
                  }`} />

                  {/* Barrido dinámico de luz estilo vinilo al iluminarse */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent w-1/2 animate-light-sweep pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}

              {/* CONTENIDO DE LA TARJETA: Formato permanente de 3 niveles idéntico a la captura (incluso a pantalla completa) */}
              <div className="p-5 sm:p-7 flex flex-col gap-4 sm:gap-5 relative z-10 w-full">
                
                {/* Nivel 1 (Superior): Número + Portada cuadrada destacada + Título grande y Detalles */}
                <div className="flex items-center gap-3.5 sm:gap-5 w-full min-w-0">
                  {/* Número de pista oficial */}
                  <span className={`font-mono font-bold text-sm sm:text-base w-6 sm:w-7 text-center shrink-0 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ${
                    isPlaying ? 'text-red-400 font-extrabold' : 'text-neutral-500 group-hover:text-red-400'
                  }`}>
                    {beat.trackNumber}
                  </span>

                  {/* Portada cuadrada con esquinas suaves y tamaño generoso */}
                  <div 
                    onClick={() => togglePlay(beat.id)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 border shrink-0 overflow-hidden flex flex-col items-center justify-center text-center relative transition-all duration-300 cursor-pointer shadow-lg ${
                      isPlaying 
                        ? 'border-red-500 shadow-[0_0_25px_rgba(220,38,38,0.8)] scale-105' 
                        : 'border-neutral-800 group-hover:border-red-500 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    }`}
                  >
                    {beat.coverUrl ? (
                      <img
                        src={beat.coverUrl}
                        alt={beat.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isPlaying ? 'scale-110' : 'group-hover:scale-110'
                        }`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <ImageIcon className="w-6 h-6 text-neutral-500" />
                        <span className="text-[10px] font-mono tracking-tight text-neutral-400 uppercase mt-0.5">
                          Portada
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Título en tipografía Rubik y Línea de especificaciones */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className={`font-rubik text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase truncate transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,1)] ${
                        isPlaying ? 'text-red-400' : 'text-white group-hover:text-red-400'
                      }`}>
                        {beat.title}
                      </h3>

                      {/* Etiqueta NOW PLAYING técnica con punto pulsante */}
                      {isPlaying && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/40 border border-red-500 text-[10px] sm:text-xs font-mono font-bold text-white uppercase tracking-widest shadow-[0_0_14px_rgba(239,68,68,0.6)] animate-pulse select-none backdrop-blur-md">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                          NOW PLAYING
                        </span>
                      )}

                      {!beat.hasExclusive && (
                        <span className="px-2.5 py-0.5 rounded-md bg-black/85 border border-neutral-700/80 text-[10px] sm:text-[11px] font-mono text-neutral-300 uppercase tracking-wider backdrop-blur-md shadow-sm">
                          Sin Exclusiva
                        </span>
                      )}
                    </div>
                    
                    {/* Línea de detalles exacta: “[Estilo] · [BPM] BPM · [Tono] · [Mood]” */}
                    <div className="text-xs sm:text-sm font-mono text-neutral-200 mt-1.5 tracking-wider truncate drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-medium">
                      {beat.detailsLine}
                    </div>
                  </div>
                </div>

                {/* Nivel 2 (Centro): Barra completa del reproductor de estudio a todo el ancho */}
                <div className="w-full">
                  <div className={`py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl border backdrop-blur-md transition-all duration-300 flex items-center justify-between gap-4 w-full ${
                    isPlaying 
                      ? 'border-red-500 bg-black/90 shadow-[0_0_25px_rgba(220,38,38,0.5)] ring-1 ring-red-500/60' 
                      : 'border-neutral-800 bg-black/85 group-hover:border-neutral-700 group-hover:bg-black/90 shadow-md'
                  }`}>
                    {/* Elemento de audio con ruta requerida y atributos controls + preload="none" */}
                    <audio
                      ref={(el) => {
                        audioRefs.current[beat.id] = el;
                      }}
                      controls
                      preload="none"
                      src={`audio/MUESTRA - ${beat.title}.mp3`}
                      onPlay={() => handlePlay(beat.id)}
                      onPause={() => handlePause(beat.id)}
                      onEnded={() => handleEnded(beat.id)}
                      onTimeUpdate={(e) => handleTimeUpdate(beat.id, e)}
                      onLoadedMetadata={(e) => handleTimeUpdate(beat.id, e)}
                      className="sr-only"
                    />

                    {/* Botón de reproducción estilo consola de estudio */}
                    <button
                      type="button"
                      onClick={() => togglePlay(beat.id)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                        isPlaying
                          ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.9)] scale-105 active:scale-95'
                          : 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-red-500 hover:text-red-400 hover:scale-105 active:scale-95'
                      }`}
                      title={isPlaying ? 'Pausar muestra' : 'Reproducir muestra'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Barra de onda acústica interactiva con scrubber */}
                    <div 
                      onClick={(e) => handleSeek(beat.id, e)}
                      className="flex-1 flex flex-col justify-center gap-1.5 cursor-pointer py-1 group/wave min-w-[140px]"
                      title="Haz clic para avanzar o retroceder"
                    >
                      {/* Onda sonora interactiva */}
                      <div className="flex items-end gap-[3px] h-5 w-full">
                        {WAVEFORM_BARS.map((heightPercent, idx) => {
                          const barProgress = (idx / WAVEFORM_BARS.length) * 100;
                          const currentPercent = prog.duration ? (prog.current / prog.duration) * 100 : 0;
                          const isPassed = barProgress <= currentPercent;
                          return (
                            <span
                              key={idx}
                              style={{ height: `${heightPercent}%` }}
                              className={`flex-1 min-w-[2px] rounded-full transition-all duration-150 ${
                                isPassed
                                  ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.7)]'
                                  : isPlaying
                                    ? 'bg-neutral-800 group-hover/wave:bg-neutral-700'
                                    : 'bg-neutral-850 group-hover/wave:bg-neutral-750'
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Contador de tiempo y BPM */}
                      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider">
                        <span className={isPlaying ? 'text-red-400 font-bold' : 'text-neutral-400'}>
                          {formatTime(prog.current)}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                          {beat.bpm} BPM
                        </span>
                        <span className="text-neutral-400">
                          {prog.duration ? formatTime(prog.duration) : '0:30'}
                        </span>
                      </div>
                    </div>

                    {/* Barras del ecualizador pulsante a ritmo de la música */}
                    <div 
                      className="flex items-end gap-1 h-6 px-1 py-0.5 shrink-0 border-l border-neutral-800 pl-3" 
                      title={isPlaying ? `Al ritmo de ${beat.bpm} BPM` : 'Ecualizador'}
                    >
                      <span 
                        style={isPlaying ? { animationDuration: beatEqDuration.d1 } : undefined}
                        className={`w-1 rounded-full transition-colors duration-200 h-2.5 ${
                          isPlaying 
                            ? 'bg-red-500 animate-eq-1 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                            : 'bg-neutral-700 group-hover:bg-red-500 group-hover:animate-eq-1 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                        }`} 
                      />
                      <span 
                        style={isPlaying ? { animationDuration: beatEqDuration.d2 } : undefined}
                        className={`w-1 rounded-full transition-colors duration-200 h-5 ${
                          isPlaying 
                            ? 'bg-red-500 animate-eq-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                            : 'bg-neutral-700 group-hover:bg-red-500 group-hover:animate-eq-2 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                        }`} 
                      />
                      <span 
                        style={isPlaying ? { animationDuration: beatEqDuration.d3 } : undefined}
                        className={`w-1 rounded-full transition-colors duration-200 h-3.5 ${
                          isPlaying 
                            ? 'bg-red-500 animate-eq-3 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                            : 'bg-neutral-700 group-hover:bg-red-500 group-hover:animate-eq-3 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                        }`} 
                      />
                      <span 
                        style={isPlaying ? { animationDuration: beatEqDuration.d4 } : undefined}
                        className={`w-1 rounded-full transition-colors duration-200 h-6 ${
                          isPlaying 
                            ? 'bg-red-500 animate-eq-4 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                            : 'bg-neutral-700 group-hover:bg-red-500 group-hover:animate-eq-4 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                        }`} 
                      />
                      <span 
                        style={isPlaying ? { animationDuration: beatEqDuration.d5 } : undefined}
                        className={`w-1 rounded-full transition-colors duration-200 h-3 ${
                          isPlaying 
                            ? 'bg-red-500 animate-eq-5 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                            : 'bg-neutral-700 group-hover:bg-red-500 group-hover:animate-eq-5 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Nivel 3 (Inferior): Botón de Licencias a la izquierda y Botón DM a la derecha */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5 w-full">
                  {/* Botón Desplegable de Licencias */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(beat.id)}
                    className={`py-2 px-3.5 sm:px-4 rounded-xl border backdrop-blur-md text-left transition-all duration-200 group/btn flex items-center justify-between gap-3 cursor-pointer select-none ${
                      isExpanded 
                        ? 'border-red-500 bg-black/90 shadow-[0_0_15px_rgba(220,38,38,0.4)] ring-1 ring-red-500/50 text-white' 
                        : 'border-neutral-800 hover:border-red-500/70 bg-black/85 hover:bg-black/90 text-neutral-200'
                    }`}
                    title="Haz clic para desplegar y seleccionar tu licencia"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-rubik text-xs sm:text-sm uppercase font-bold tracking-wider text-white group-hover/btn:text-red-400 transition-colors drop-shadow-sm">
                        {selectedLic ? `Licencia: ${selectedLic.name}` : 'Licencias'}
                      </span>
                      <span className="font-mono text-red-500 text-xs sm:text-sm font-bold px-2 py-0.5 rounded-lg bg-black/90 border border-red-500/40">
                        {selectedLic ? selectedLic.price : (beat.hasExclusive ? '29 € - 450 €' : '29 € - 179 €')}
                      </span>
                    </div>
                    <div className={`p-1 rounded-full border transition-all duration-300 shrink-0 ${
                      isExpanded 
                        ? 'rotate-180 bg-red-600/20 border-red-500/60 text-red-500' 
                        : 'bg-black/80 border-neutral-700 text-neutral-400 group-hover/btn:border-neutral-600 group-hover/btn:text-white'
                    }`}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Botón DM de Instagram */}
                  <a
                    href={`${ASSETS.INSTAGRAM_DM}?text=${encodeURIComponent(dmText)}`}
                    onClick={() => copyAndNotifyDM(dmText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold font-rubik uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_20px_rgba(220,38,38,0.7)] cursor-pointer shrink-0"
                    title={`Enviar DM: "${dmText}"`}
                  >
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{selectedLic ? `DM • ${selectedLic.name.toUpperCase()}` : 'DM'}</span>
                  </a>
                </div>

              </div>

              {/* SECCIÓN DESPLEGADA: SELECTOR MINIMALISTA Y ELEGANTE */}
              <div className={`transition-all duration-300 ease-in-out border-t border-neutral-800/80 bg-black/85 backdrop-blur-md relative z-10 ${isExpanded ? 'max-h-[300px] opacity-100 p-3 sm:p-4' : 'max-h-0 opacity-0 p-0 overflow-hidden border-t-0'}`}>
                <div className="space-y-2.5">
                  {/* Selector compacto de 4 licencias */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LICENSES.map((lic) => {
                      const isExclusive = lic.id === 'exclusiva';
                      const isUnavailable = isExclusive && !beat.hasExclusive;
                      const isSelected = selectedLicId === lic.id;

                      if (isUnavailable) {
                        return (
                          <div
                            key={lic.id}
                            className="p-2.5 rounded-lg border border-neutral-900 bg-black/40 opacity-35 cursor-not-allowed select-none text-left"
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-rubik text-xs font-bold uppercase tracking-wider text-neutral-600">{lic.name}</span>
                              <span className="font-mono text-[10px] text-neutral-600 line-through">Exclusiva</span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-600 block">No disponible</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={lic.id}
                          type="button"
                          onClick={() => {
                            setSelectedLicenses(prev => ({
                              ...prev,
                              [beat.id]: lic.id
                            }));
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer select-none group/opt ${
                            isSelected
                              ? 'border-red-600 bg-red-950/30 shadow-[0_0_15px_rgba(220,38,38,0.35)] ring-1 ring-red-600/50'
                              : 'border-neutral-850 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`font-rubik text-xs font-bold uppercase tracking-wider transition-colors ${
                              isSelected ? 'text-red-400' : 'text-neutral-200 group-hover/opt:text-white'
                            }`}>
                              {lic.name}
                            </span>
                            <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-red-500'}`}>
                              {lic.price}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className={isSelected ? 'text-neutral-300' : 'text-neutral-400'}>
                              {lic.id === 'esencial' && 'MP3'}
                              {lic.id === 'premium' && 'MP3 + WAV'}
                              {lic.id === 'stems' && 'WAV + Pistas'}
                              {lic.id === 'exclusiva' && 'Derechos totales'}
                            </span>
                            {isSelected ? (
                              <span className="text-red-400 font-semibold flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Activo
                              </span>
                            ) : (
                              <span className="text-neutral-500 group-hover/opt:text-neutral-300">
                                Elegir
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Línea sutil de confirmación del mensaje configurado para DM */}
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 px-1 pt-1 border-t border-neutral-900/80">
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <span className="text-neutral-500 shrink-0">Mensaje DM:</span>
                      <span className="text-neutral-200 truncate font-semibold text-red-400/90">"{dmText}"</span>
                    </div>

                    <a
                      href={`${ASSETS.INSTAGRAM_DM}?text=${encodeURIComponent(dmText)}`}
                      onClick={() => copyAndNotifyDM(dmText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-400 font-bold uppercase tracking-wider shrink-0 transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                      <span>Abrir DM →</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
