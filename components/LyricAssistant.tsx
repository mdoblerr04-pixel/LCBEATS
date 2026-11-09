import React, { useState } from 'react';
import { Beat } from '../types';
import { generateLyrics } from '../services/geminiService';
import { X, Sparkles, Zap } from './Icons';

interface LyricAssistantProps {
  beat: Beat;
  onClose: () => void;
}

export const LyricAssistant: React.FC<LyricAssistantProps> = ({ beat, onClose }) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Freestyle');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setGeneratedLyrics('');
    
    const result = await generateLyrics(beat, topic, style);
    
    setGeneratedLyrics(result);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-neutral-900 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] border border-neutral-800">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight">AI WRITER</h2>
              <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest">Beat: <span className="text-red-500">{beat.title}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 transition-colors">
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-neutral-950">
          {!generatedLyrics ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Concepto / Tema</label>
                <textarea 
                  className="w-full bg-neutral-900 border border-neutral-800 p-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 min-h-[120px] font-sans placeholder-neutral-600"
                  placeholder="Describe la vibra... Ej: Una noche en la ciudad, traición, dinero, éxito..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Flow & Estilo</label>
                <div className="flex flex-wrap gap-2">
                  {['Freestyle', 'Trap Hard', 'Reggaeton', 'Melódico', 'Consciente'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all skew-x-[-10deg] ${
                        style === s 
                          ? 'bg-red-600 text-white' 
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white'
                      }`}
                    >
                      <span className="skew-x-[10deg] inline-block">{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900/50 p-5 border border-dashed border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Datos del Beat</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="block text-neutral-600 text-[10px] uppercase font-bold">BPM</span>
                    <span className="font-mono text-yellow-500 text-lg">{beat.bpm}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-600 text-[10px] uppercase font-bold">Key</span>
                    <span className="font-mono text-white text-lg">{beat.key}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-neutral-600 text-[10px] uppercase font-bold">Genre</span>
                    <span className="text-neutral-300 font-bold uppercase">{beat.tags[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                 <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide">Lyrics Result</h3>
                 <button 
                   onClick={() => setGeneratedLyrics('')}
                   className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1"
                 >
                   <Sparkles className="w-4 h-4" />
                   Regenerar
                 </button>
               </div>
               <div className="bg-neutral-900 p-6 border border-neutral-800 whitespace-pre-wrap font-mono text-neutral-300 leading-loose text-sm shadow-inner">
                 {generatedLyrics}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!generatedLyrics && (
          <div className="p-6 border-t border-neutral-800 bg-neutral-900">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className={`w-full py-4 px-6 font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all skew-x-[-5deg] ${
                isLoading || !topic.trim()
                  ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]'
              }`}
            >
              <span className="skew-x-[5deg] flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generar Letra
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};