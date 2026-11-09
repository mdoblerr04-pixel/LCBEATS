import React from 'react';
import { ChevronDown } from './Icons';
import { ASSETS } from '../constants';

export const Hero: React.FC = () => {
  return (
    <header className="relative bg-black">
      {/* Banner Visual Display limpio, sin líneas de alrededor */}
      <div className="relative h-[36vh] md:h-[46vh] min-h-[250px] sm:min-h-[320px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div 
          className="w-full h-full absolute inset-0 pointer-events-none"
          style={{ 
            backgroundColor: '#000000',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.40)), url(${ASSETS.BANNER})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            backgroundRepeat: 'no-repeat',
            // @ts-ignore
            msInterpolationMode: 'nearest-neighbor',
            WebkitImageRendering: 'optimize-contrast',
            imageRendering: 'crisp-edges',
            filter: 'brightness(0.95)'
          } as React.CSSProperties}
        />

        {/* Textura sutil y fundido suave */}
        <div 
          className="absolute inset-0 opacity-[0.10] pointer-events-none" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Frase justo debajo del banner */}
      <div className="w-full py-6 md:py-8 bg-black border-b border-neutral-900 text-center px-4 flex flex-col items-center justify-center space-y-2">
        <h1 className="font-rubik text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-snug">
          “Tu sonido con licencia.”
        </h1>
        <p className="font-staatliches text-base sm:text-lg md:text-xl font-normal text-neutral-400 max-w-4xl mx-auto tracking-[0.2em] uppercase opacity-95">
          "Sonido único, para ideas únicas."
        </p>
        <div className="pt-2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        </div>
      </div>
    </header>
  );
};