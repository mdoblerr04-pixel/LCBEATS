import React, { useEffect, useRef, useState } from 'react';
import { Instagram, Sliders, Mic2, Headphones, Sparkles } from './Icons';
import { ASSETS, LICENSES, copyAndNotifyDM } from '../constants';

const LICENSE_ICONS: Record<string, React.ReactNode> = {
  esencial: <Sliders className="w-6 h-6" />,
  premium: <Mic2 className="w-6 h-6" />,
  stems: <Headphones className="w-6 h-6" />,
  exclusiva: <Sparkles className="w-6 h-6" />
};

export const Services: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationSettled, setAnimationSettled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Observer para revelación progresiva al hacer scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
          // Tras completarse la animación de entrada, liberar el delay para hover instantáneo
          setTimeout(() => {
            setAnimationSettled(true);
          }, 1000);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="py-24 px-4 bg-black border-t border-neutral-900 relative overflow-hidden"
    >
      {/* Background accent line con efecto de brillo */}
      <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent transition-opacity duration-1000 ${
        isVisible ? 'opacity-80' : 'opacity-20'
      }`} />

      <div className="max-w-7xl mx-auto">
        {/* Cabecera de la sección con fade-in y slide suave */}
        <div 
          className={`text-center mb-14 space-y-3 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block px-3.5 py-1 border border-neutral-800 text-neutral-400 text-xs font-bold tracking-[0.2em] uppercase rounded-full bg-neutral-950">
            LC MUSIC WORLD
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter font-display">
            LICENCIAS
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm tracking-wider font-mono uppercase">
            Precios vigentes hasta el 1 de enero de 2027
          </p>
        </div>

        {/* 4 Cajas de Licencias con Revelación Progresiva Escalonada (Staggered Fade-In) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {LICENSES.map((lic, index) => {
            const icon = LICENSE_ICONS[lic.id] || <Sliders className="w-6 h-6" />;
            const staggerDelay = `${index * 130}ms`;

            return (
              <div
                key={lic.id}
                style={{
                  transitionDelay: animationSettled ? '0ms' : staggerDelay
                }}
                className={`relative p-6 sm:p-7 flex flex-col justify-between h-full rounded-xl border border-neutral-800/90 bg-neutral-950 hover:border-red-600/70 shadow-[0_0_20px_-3px_rgba(220,38,38,0.2)] hover:shadow-[0_0_35px_rgba(230,57,0,0.45)] group transition-all duration-700 ease-out will-change-transform ${
                  isVisible
                    ? 'opacity-100 translate-y-0 scale-100 hover:-translate-y-1.5'
                    : 'opacity-0 translate-y-12 scale-[0.96] pointer-events-none'
                }`}
              >
                <div>
                  {/* Icono y Encabezado */}
                  <div className="w-12 h-12 flex items-center justify-center mb-5 border border-neutral-800 bg-neutral-900 text-red-500 rounded-lg group-hover:border-red-600/40 group-hover:scale-105 transition-all">
                    {icon}
                  </div>

                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight font-display group-hover:text-red-400 transition-colors">
                      {lic.name}
                    </h3>
                    {lic.extraInfo && (
                      <span className="text-xs text-neutral-400 tracking-wide font-normal">
                        {lic.extraInfo}
                      </span>
                    )}
                  </div>

                  {/* Precio: limpio y prominente */}
                  <div className="mb-5 pb-4 border-b border-neutral-900">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-300">
                      {lic.price}
                    </span>
                  </div>

                  {/* Descripción oficial integrada de forma limpia y legible */}
                  <div className="mb-8 text-neutral-300 text-xs sm:text-[13px] leading-relaxed font-sans">
                    <p className="leading-relaxed text-neutral-300">
                      {lic.description}
                    </p>
                  </div>
                </div>

                {/* Enlace al DM de Instagram */}
                <div className="pt-1 border-t border-neutral-900/60">
                  <p className="text-[11px] text-neutral-400 mb-2.5 leading-relaxed">
                    “Escríbenos por DM con el título del tema y te enviamos todos los detalles para que recibas tu licencia.”
                  </p>
                  <a
                    href={`${ASSETS.INSTAGRAM_DM}?text=${encodeURIComponent(`Hola, me interesa la licencia ${lic.name} (${lic.price}) - Prod. LC World`)}`}
                    onClick={() => copyAndNotifyDM(`Hola, me interesa la licencia ${lic.name} (${lic.price}) - Prod. LC World`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-md bg-neutral-900 border border-neutral-800 hover:border-red-600 hover:bg-neutral-850 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 font-rubik shadow-sm cursor-pointer"
                  >
                    <Instagram className="w-3.5 h-3.5 text-red-500" />
                    <span>Pedir por DM</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};