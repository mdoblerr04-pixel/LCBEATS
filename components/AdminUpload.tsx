
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { X, Upload, Music, Image, Loader, Check, Lock, File } from './Icons';

interface AdminUploadProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const AdminUpload: React.FC<AdminUploadProps> = ({ onClose, onUploadSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState('');
  const [price, setPrice] = useState('29.99');
  const [key, setKey] = useState('Am');
  const [tags, setTags] = useState('');
  
  // Public Files (Showcase)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  
  // Private Files (Products)
  const [mp3LeaseFile, setMp3LeaseFile] = useState<File | null>(null);
  const [wavLeaseFile, setWavLeaseFile] = useState<File | null>(null);
  const [stemsFile, setStemsFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'LCMUSICBOSS') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const sanitizeFileName = (originalName: string) => {
    const name = originalName.split('.')[0];
    const ext = originalName.split('.').pop();
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `${cleanName}-${Date.now()}.${ext}`;
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileName = sanitizeFileName(file.name);
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
    });
    if (error) throw new Error(`${bucket.toUpperCase()} Error: ${error.message}`);
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewFile || !imageFile || !mp3LeaseFile) {
      alert('Faltan archivos obligatorios: Portada, Preview y Licencia MP3.');
      return;
    }

    setIsUploading(true);
    setStatus('Iniciando carga masiva...');

    try {
      // Parallel Uploads for maximum speed
      const uploadPromises = [
        uploadFile(imageFile, 'covers').then(url => ({ type: 'cover', url })),
        uploadFile(previewFile, 'previews').then(url => ({ type: 'audio', url })),
        uploadFile(mp3LeaseFile, 'downloads').then(url => ({ type: 'download', url })),
        wavLeaseFile ? uploadFile(wavLeaseFile, 'downloads').then(url => ({ type: 'wav', url })) : Promise.resolve(null),
        stemsFile ? uploadFile(stemsFile, 'downloads').then(url => ({ type: 'stems', url })) : Promise.resolve(null)
      ];

      setStatus('Subiendo archivos a la nube... (Esto puede tardar unos minutos si los archivos son pesados)');
      
      const results = await Promise.all(uploadPromises);
      
      // Extract URLs from results
      const coverUrl = results.find(r => r?.type === 'cover')?.url || '';
      const audioUrl = results.find(r => r?.type === 'audio')?.url || '';
      const downloadUrl = results.find(r => r?.type === 'download')?.url || '';
      const wavUrl = results.find(r => r?.type === 'wav')?.url || '';
      const stemsUrl = results.find(r => r?.type === 'stems')?.url || '';

      // Database Insert
      setStatus('Registrando en base de datos...');
      const { error: dbError } = await supabase.from('beats').insert([
        {
          title,
          bpm: parseInt(bpm),
          price: parseFloat(price),
          key,
          tags: tags.split(',').map(t => t.trim()),
          cover_url: coverUrl,
          audio_url: audioUrl,
          download_url: downloadUrl, // MP3 Lease
          wav_url: wavUrl,           // WAV Lease
          stems_url: stemsUrl,       // Stems
          producer: 'LC MUSIC WORLD'
        }
      ]);

      if (dbError) throw new Error(`DB Error: ${dbError.message}`);

      setStatus('¡BEAT PUBLICADO CON ÉXITO!');
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md">
        <div className="bg-neutral-900 p-8 border border-neutral-800 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 font-display uppercase">Acceso Productor</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña Maestra"
              className="w-full bg-black border border-neutral-700 p-4 text-center text-white tracking-widest focus:border-red-600 outline-none"
            />
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 uppercase tracking-widest">
              Entrar
            </button>
            <button type="button" onClick={onClose} className="text-neutral-500 text-sm hover:text-white mt-4">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 w-full max-w-5xl border border-neutral-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/10 border border-red-600/20">
              <Upload className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight">Nuevo Lanzamiento</h2>
              <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest">Panel de Control</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 transition-colors">
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {isUploading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 min-h-[400px]">
              <div className="relative">
                 <div className="w-24 h-24 rounded-full border-4 border-neutral-800 border-t-red-600 animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white animate-pulse" />
                 </div>
              </div>
              <div className="text-center max-w-md mx-auto space-y-2">
                <h3 className="text-2xl font-bold text-white animate-pulse">{status}</h3>
                <p className="text-neutral-500 text-sm">
                    Estamos procesando archivos de alta calidad (WAV/Stems). 
                    <br />
                    <span className="text-yellow-500 font-bold">NO CIERRES ESTA VENTANA</span>
                </p>
                {stemsFile && (
                    <div className="pt-4">
                        <span className="text-xs text-neutral-600 border border-neutral-800 px-2 py-1 rounded">Archivo Pesado Detectado: {stemsFile.name}</span>
                    </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Left Column: Metadata */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2">1. Metadatos</h3>
                
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Título</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-yellow-500 outline-none font-display uppercase tracking-wider text-lg"
                    placeholder="Ej: ATOMIC"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">BPM</label>
                    <input 
                      type="number" 
                      value={bpm} 
                      onChange={e => setBpm(e.target.value)}
                      className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-yellow-500 outline-none"
                      placeholder="140"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Key</label>
                    <input 
                      type="text" 
                      value={key} 
                      onChange={e => setKey(e.target.value)}
                      className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-yellow-500 outline-none"
                      placeholder="Cm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Precio Base ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-black border border-neutral-800 p-4 text-yellow-500 font-bold focus:border-yellow-500 outline-none text-xl"
                    placeholder="29.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tags</label>
                  <input 
                    type="text" 
                    value={tags} 
                    onChange={e => setTags(e.target.value)}
                    className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-yellow-500 outline-none"
                    placeholder="Trap, Dark, Hard"
                  />
                </div>
              </div>

              {/* Right Column: Files */}
              <div className="space-y-8">
                
                {/* Public Assets */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2">2. Escaparate (Público)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FileUpload 
                      label="Portada" 
                      subLabel="JPG/PNG"
                      file={imageFile} 
                      setFile={setImageFile} 
                      icon={<Image />} 
                      colorClass="text-yellow-500"
                      borderColor="border-yellow-500"
                    />
                    <FileUpload 
                      label="Preview" 
                      subLabel="MP3 con TAG"
                      file={previewFile} 
                      setFile={setPreviewFile} 
                      icon={<Music />} 
                      colorClass="text-red-600"
                      borderColor="border-red-600"
                    />
                  </div>
                </div>

                {/* Private Assets */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    3. Almacén (Privado)
                  </h3>
                  
                  <FileUpload 
                    label="MP3 Lease" 
                    subLabel="MP3 Sin Tag (Obligatorio)"
                    file={mp3LeaseFile} 
                    setFile={setMp3LeaseFile} 
                    icon={<File />} 
                    colorClass="text-cyan-500"
                    borderColor="border-cyan-500"
                    fullWidth
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FileUpload 
                      label="WAV Lease" 
                      subLabel="WAV (Opcional)"
                      file={wavLeaseFile} 
                      setFile={setWavLeaseFile} 
                      icon={<File />} 
                      colorClass="text-purple-500"
                      borderColor="border-purple-500"
                    />
                    <FileUpload 
                      label="Stems / Zip" 
                      subLabel="Trackout (Opcional)"
                      file={stemsFile} 
                      setFile={setStemsFile} 
                      icon={<File />} 
                      colorClass="text-green-500"
                      borderColor="border-green-500"
                    />
                  </div>
                </div>

              </div>
              
              <div className="lg:col-span-2 pt-4 border-t border-neutral-800">
                 <button 
                  type="submit"
                  className="w-full py-5 bg-white hover:bg-neutral-200 text-black font-bold text-xl uppercase tracking-widest transition-all skew-x-[-5deg]"
                >
                  <span className="skew-x-[5deg] flex items-center justify-center gap-3">
                    <Upload className="w-6 h-6" />
                    Publicar Beat Ahora
                  </span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for file inputs
const FileUpload = ({ label, subLabel, file, setFile, icon, colorClass, borderColor, fullWidth }: any) => (
  <div className={`relative ${fullWidth ? 'col-span-2' : ''}`}>
    <input 
      type="file" 
      id={label} 
      className="hidden" 
      onChange={e => setFile(e.target.files?.[0] || null)} 
    />
    <label 
      htmlFor={label} 
      className={`cursor-pointer block border-2 border-dashed p-4 text-center transition-all bg-neutral-900/50 hover:bg-neutral-800 ${
        file ? `${borderColor} bg-opacity-10` : 'border-neutral-800 hover:border-neutral-600'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 bg-neutral-950 ${
        file ? colorClass : 'text-neutral-600'
      }`}>
        {file ? <Check className="w-4 h-4" /> : React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
      <span className={`block font-bold uppercase tracking-wider text-xs mb-0.5 ${file ? 'text-white' : 'text-neutral-400'}`}>
        {file ? 'Listo' : label}
      </span>
      <span className="text-[10px] text-neutral-600 block truncate px-2">
        {file ? file.name : subLabel}
      </span>
    </label>
  </div>
);
