import React from 'react';

const steps = [
  { id: '01', label: 'IDENTIDAD' },
  { id: '02', label: 'COMPOSICIÓN' },
  { id: '03', label: 'PRODUCCIÓN' },
  { id: '04', label: 'MEZCLA' },
  { id: '05', label: 'MASTERING' },
  { id: '06', label: 'ESTRATEGIA' },
  { id: '07', label: 'LANZAMIENTO' },
];

export const Structure: React.FC = () => {
  return (
    <div className="w-full">
      {/* Background decoration - very subtle */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/2 blur-[150px] -z-10 rotate-12 transform translate-x-1/2"></div>
      
      <div className="flex flex-col items-center text-center mb-16">
        <div className="relative">
          <h2 className="text-[10vw] md:text-7xl font-bold uppercase tracking-tighter font-display leading-none select-none">
            <span className="text-white">LA</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-600">
              ESTRUCTURA
            </span>
          </h2>
        </div>
      </div>

      {/* Steps Timeline - Back to Circles */}
      <div className="relative mt-8">
        {/* Horizontal Line (Desktop) */}
        <div className="absolute top-6 left-0 w-full h-[1px] bg-neutral-900 hidden md:block">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#E08030]/20 to-transparent w-full"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-y-12 gap-2 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center group">
              <div className="relative mb-4">
                {/* Outer circle with diffused style like 'MÁQUINA' */}
                <div className="w-12 h-12 rounded-full border border-neutral-800 bg-black flex items-center justify-center font-display text-sm group-hover:border-[#E08030]/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative z-10">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#CC2020] to-[#E08030] font-bold">
                     {step.id}
                  </span>
                </div>
                {/* Diffused glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#CC2020] to-[#E08030] blur-xl opacity-10 group-hover:opacity-40 transition-opacity rounded-full -z-10" />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 group-hover:text-white transition-colors duration-300 text-center">
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
