import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { BeatList } from './components/BeatList';
import { Services } from './components/Services';
import { ChevronDown, Instagram, Check, X } from './components/Icons';
import { ASSETS } from './constants';

function CollapsibleSection({ 
  title, 
  children, 
  isOpen, 
  onToggle, 
  id 
}: { 
  title: React.ReactNode; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
  id?: string;
}) {
  return (
    <section id={id} className="border-b border-neutral-900 transition-all duration-500 relative bg-black">
      <button 
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full py-8 px-4 flex items-center justify-between group hover:bg-neutral-900/10 transition-colors"
      >
        <div className="max-w-7xl mx-auto w-full relative flex items-center justify-center">
          <div className="text-center">
            {title}
          </div>
          <div className={`absolute right-0 p-2 rounded-full border border-neutral-900 group-hover:border-red-600/50 transition-all duration-300 ${isOpen ? 'rotate-180 bg-red-600/10' : ''}`}>
            <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-red-600' : 'text-neutral-700 group-hover:text-white'}`} />
          </div>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[16000px] opacity-100 py-10' : 'max-h-0 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    catalog: true
  });
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  React.useEffect(() => {
    const handleCopied = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      if (customEvent.detail?.text) {
        setCopiedMessage(customEvent.detail.text);
        setCopiedSuccess(false);
      }
    };

    window.addEventListener('lc-copy-dm', handleCopied);
    return () => {
      window.removeEventListener('lc-copy-dm', handleCopied);
    };
  }, []);

  React.useEffect(() => {
    if (!copiedMessage) return;
    const timer = setTimeout(() => {
      setCopiedMessage(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [copiedMessage]);

  const handleManualReCopy = () => {
    if (!copiedMessage) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(copiedMessage).then(() => {
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2500);
      }).catch(() => {});
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const GRADIENT_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] via-[#FF4D00] to-[#FFEA00]";

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans">
      {/* Main Content */}
      <main>
        {/* 1. Cabecera */}
        <Hero />

        {/* 2. Catálogo: 15 Beats */}
        <CollapsibleSection
          id="catalog"
          title={
            <div className="inline-flex items-center justify-center gap-3 md:gap-5">
              <span className="hidden sm:block w-8 md:w-16 h-px bg-gradient-to-r from-transparent to-neutral-900" />
              <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.25em] font-rubik text-center px-6 py-2.5 rounded-lg border border-neutral-900 bg-black/80 shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                <span className={`${GRADIENT_TEXT} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
                  CATÁLOGO
                </span>
              </h2>
              <span className="hidden sm:block w-8 md:w-16 h-px bg-gradient-to-l from-transparent to-neutral-900" />
            </div>
          }
          isOpen={openSections.catalog}
          onToggle={() => toggleSection('catalog')}
        >
          <BeatList />
        </CollapsibleSection>

        {/* 3 & 4. Cajas de Licencias */}
        <Services />
      </main>

      {/* Footer con banner de fondo claramente visible */}
      <footer className="relative py-28 px-4 border-t border-neutral-900 overflow-hidden text-center bg-black">
        {/* Banner de fondo claramente visible */}
        <div 
          className="w-full h-full absolute inset-0 pointer-events-none"
          style={{ 
            backgroundColor: '#000000',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url(${ASSETS.BANNER})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat',
            // @ts-ignore
            msInterpolationMode: 'nearest-neighbor',
            WebkitImageRendering: 'optimize-contrast',
            imageRendering: 'crisp-edges',
            filter: 'brightness(0.78)'
          } as React.CSSProperties}
        />
        {/* Grain/Texture effect overlay */}
        <div 
          className="absolute inset-0 opacity-[0.12] pointer-events-none" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />

        {/* Logo LC WORLD de fondo muy transparente */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
          <img 
            src={ASSETS.LOGO} 
            alt="LC WORLD Watermark" 
            className="w-96 h-96 object-contain mix-blend-lighten"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8">
          {/* Enlace de Instagram encima de la frase */}
          <a
            href={ASSETS.INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-neutral-700/80 bg-black/80 hover:bg-black hover:border-red-600/70 transition-all duration-300 group shadow-2xl hover:scale-105"
          >
            <Instagram className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="font-rubik text-xs md:text-sm tracking-[0.25em] text-neutral-200 group-hover:text-white uppercase">
              INSTAGRAM • {ASSETS.INSTAGRAM_HANDLE}
            </span>
          </a>

          {/* Frase central */}
          <p className="font-clarity text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[0.12em] uppercase opacity-95 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] max-w-4xl leading-snug text-center">
            "SOLO DECIDE CUÁNTO CORAZÓN PONER."
          </p>

          <div className="pt-6 text-neutral-400 text-[10px] uppercase tracking-[0.3em] drop-shadow-md">
            © {new Date().getFullYear()} LC WORLD MUSIC • TODOS LOS DERECHOS RESERVADOS
          </div>
        </div>
      </footer>

      {/* HUD Toast de Notificación: Portapapeles sincronizado para Instagram DM */}
      {copiedMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-[420px] rounded-xl border border-red-600/70 bg-black/95 backdrop-blur-md shadow-[0_0_35px_rgba(220,38,38,0.45)] p-4 text-neutral-200 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Header del Toast */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              <span className="font-rubik text-xs font-bold uppercase tracking-widest text-red-400">
                PORTAPAPELES SINCRONIZADO
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCopiedMessage(null)}
              className="text-neutral-500 hover:text-white p-1 rounded transition-colors"
              title="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Explicación técnica y práctica */}
          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
            Instagram no permite rellenar el texto automáticamente por enlace. <strong className="text-white font-medium">El mensaje ya está en tu portapapeles:</strong> entra al chat y pulsa <span className="font-mono text-red-400 font-semibold bg-neutral-900 px-1 py-0.5 rounded">Pegar</span> (Ctrl+V).
          </p>

          {/* Caja con el texto exacto copiado */}
          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-200 break-words mb-3 select-all">
            {copiedMessage}
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualReCopy}
              className="flex-1 py-1.5 px-3 rounded bg-neutral-900 border border-neutral-700 hover:border-red-500 text-xs font-rubik uppercase font-bold tracking-wider text-neutral-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <span>Copiar de nuevo</span>
                </>
              )}
            </button>
            <a
              href={ASSETS.INSTAGRAM_DM}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-rubik uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Abrir DM</span>
            </a>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
