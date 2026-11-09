export const ASSETS = {
  LOGO: 'https://i.postimg.cc/w75sBdGC/lc-world-logo-png.png',
  BANNER: 'https://i.postimg.cc/DyHQBvQp/lc-world-banner-png.png',
  INSTAGRAM_URL: 'https://www.instagram.com/lcworldmusic/',
  INSTAGRAM_DM: 'https://ig.me/m/lcworldmusic',
  INSTAGRAM_HANDLE: '@lcworldmusic'
};

export const copyAndNotifyDM = (text: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lc-copy-dm', { detail: { text } }));
  }
};

export interface BeatItem {
  id: string;
  trackNumber: string;
  title: string;
  style: string;
  bpm: string;
  key: string;
  mood: 'Oscuro' | 'Chill' | 'Nostálgico' | 'Doble tempo';
  detailsLine: string;
  hasExclusive: boolean;
  coverUrl?: string;
  audioUrl?: string;
  referenceDetail?: string; // Elemento escénico extraído de la portada
  bgPosition?: string;     // Coordenadas de encuadre en el elemento
  bgSize?: string;         // Escala de enfoque para evitar redundancia de texto
}

// Lista oficial de 15 beats en orden exacto
export const BEATS_15: BeatItem[] = [
  {
    id: '1',
    trackNumber: '01',
    title: 'KILL BEAT',
    style: 'Rap',
    bpm: '95',
    key: 'A menor',
    mood: 'Oscuro',
    detailsLine: 'Rap · 95 BPM · A menor · Oscuro',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_KILL_BEAT_14441502.png',
    audioUrl: 'audio/MUESTRA - KILL BEAT.mp3',
    referenceDetail: 'Herrero forjando notas musicales en el yunque',
    bgPosition: '50% 64%',
    bgSize: '135%'
  },
  {
    id: '2',
    trackNumber: '02',
    title: 'INTEGRIDAD',
    style: 'Rap',
    bpm: '95',
    key: 'E menor',
    mood: 'Oscuro',
    detailsLine: 'Rap · 95 BPM · E menor · Oscuro',
    hasExclusive: false, // Sin Exclusiva
    coverUrl: '/assets/aistudio/PORTADA_-_INTEGRIDAD_2c1a1b75.png',
    audioUrl: 'audio/MUESTRA - INTEGRIDAD.mp3',
    referenceDetail: 'Graffiti INTEGRIDAD con farola y lluvia',
    bgPosition: '50% 50%',
    bgSize: '118%'
  },
  {
    id: '3',
    trackNumber: '03',
    title: 'MONEY',
    style: 'Trap',
    bpm: '160 BPM (doble tempo)',
    key: 'G mayor',
    mood: 'Doble tempo',
    detailsLine: 'Trap · 160 BPM (doble tempo) · G mayor · Doble tempo',
    hasExclusive: false, // Sin Exclusiva
    coverUrl: '/assets/aistudio/MONEY_-_PORTADA_7e2e660b.png',
    audioUrl: 'audio/MUESTRA - MONEY.mp3',
    referenceDetail: 'Billetes de 100$ flotando en el aire',
    bgPosition: '55% 25%',
    bgSize: '160%'
  },
  {
    id: '4',
    trackNumber: '04',
    title: 'CHILL BOOMBAP',
    style: 'Rap',
    bpm: '95',
    key: 'C mayor',
    mood: 'Chill',
    detailsLine: 'Rap · 95 BPM · C mayor · Chill',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/CHILL_B.B_-_PORTADAS_cbb54ba2.png',
    audioUrl: 'audio/MUESTRA - CHILL BOOMBAP.mp3',
    referenceDetail: 'Graffiti CHILL B.B. y balón en asfalto',
    bgPosition: '50% 50%',
    bgSize: '120%'
  },
  {
    id: '5',
    trackNumber: '05',
    title: 'EMINENCIA',
    style: 'Drill',
    bpm: '130',
    key: 'E menor',
    mood: 'Oscuro',
    detailsLine: 'Drill · 130 BPM · E menor · Oscuro',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_EMINENCIA_0d0ee7df.png',
    audioUrl: 'audio/MUESTRA - EMINENCIA.mp3',
    referenceDetail: 'Graffiti EMINENCIA con corona dorada y farola',
    bgPosition: '50% 48%',
    bgSize: '120%'
  },
  {
    id: '6',
    trackNumber: '06',
    title: 'NOSTALGIA',
    style: 'Rap',
    bpm: '90',
    key: 'C mayor',
    mood: 'Nostálgico',
    detailsLine: 'Rap · 90 BPM · C mayor · Nostálgico',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_NOSTALGIA_1fdde21a.png',
    audioUrl: 'audio/MUESTRA - NOSTALGIA.mp3',
    referenceDetail: 'Graffiti NOSTALGIA y boombox vintage',
    bgPosition: '50% 50%',
    bgSize: '120%'
  },
  {
    id: '7',
    trackNumber: '07',
    title: 'HARD ARCADE',
    style: 'Rap',
    bpm: '95',
    key: 'A menor',
    mood: 'Oscuro',
    detailsLine: 'Rap · 95 BPM · A menor · Oscuro',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_HARD_ARCADE_e7f3717a.png',
    audioUrl: 'audio/MUESTRA - HARD ARCADE.mp3',
    referenceDetail: 'Graffiti HARD ARCADE y cubo demoníaco',
    bgPosition: '48% 48%',
    bgSize: '120%'
  },
  {
    id: '8',
    trackNumber: '08',
    title: 'COSMOS',
    style: 'Rap',
    bpm: '80',
    key: 'E menor',
    mood: 'Chill',
    detailsLine: 'Rap · 80 BPM · E menor · Chill',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/COSMOS_-_PORTADA_ff42361c.png',
    audioUrl: 'audio/MUESTRA - COSMOS.mp3',
    referenceDetail: 'Astronauta en cornisa & galaxia espiral dorada',
    bgPosition: '50% 75%',
    bgSize: '160%'
  },
  {
    id: '9',
    trackNumber: '09',
    title: 'KOMODO',
    style: 'Rap',
    bpm: '90',
    key: 'A menor',
    mood: 'Oscuro',
    detailsLine: 'Rap · 90 BPM · A menor · Oscuro',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_KOMODO_32858d70.png',
    audioUrl: 'audio/MUESTRA - KOMODO.mp3',
    referenceDetail: 'Dragón de Komodo gigante sobre los rascacielos',
    bgPosition: '50% 32%',
    bgSize: '160%'
  },
  {
    id: '10',
    trackNumber: '10',
    title: 'RECUERDO',
    style: 'Rap',
    bpm: '85',
    key: 'C mayor',
    mood: 'Nostálgico',
    detailsLine: 'Rap · 85 BPM · C mayor · Nostálgico',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_RECUERDOS_ebe7a0ab.png',
    audioUrl: 'audio/MUESTRA - RECUERDO.mp3',
    referenceDetail: 'Polaroids familiares colgadas con pinzas de madera',
    bgPosition: '50% 25%',
    bgSize: '160%'
  },
  {
    id: '11',
    trackNumber: '11',
    title: 'FARAONICO',
    style: 'Rap',
    bpm: '95',
    key: 'G menor',
    mood: 'Chill',
    detailsLine: 'Rap · 95 BPM · G menor · Chill',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_FARAONICO_6dbdade8.png',
    audioUrl: 'audio/MUESTRA - FARAONICO.mp3',
    referenceDetail: 'Graffiti FARAONICO y máscara de Tutankamón',
    bgPosition: '52% 48%',
    bgSize: '120%'
  },
  {
    id: '12',
    trackNumber: '12',
    title: 'ESPERANZA',
    style: 'Rap',
    bpm: '95',
    key: 'C mayor',
    mood: 'Nostálgico',
    detailsLine: 'Rap · 95 BPM · C mayor · Nostálgico',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_ESPERANZA_4d0e8e93.png',
    audioUrl: 'audio/MUESTRA - ESPERANZA.mp3',
    referenceDetail: 'Puente colgante & skyline urbano al amanecer',
    bgPosition: '78% 28%',
    bgSize: '160%'
  },
  {
    id: '13',
    trackNumber: '13',
    title: 'ALHAJERO',
    style: 'Rap',
    bpm: '95',
    key: 'E menor',
    mood: 'Nostálgico',
    detailsLine: 'Rap · 95 BPM · E menor · Nostálgico',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/ALHAJERO_-_PORTADA_d9955dea.png',
    audioUrl: 'audio/MUESTRA - ALHAJERO.mp3',
    referenceDetail: 'Graffiti ALHAJERO y coche lowrider clásico',
    bgPosition: '48% 52%',
    bgSize: '120%'
  },
  {
    id: '14',
    trackNumber: '14',
    title: 'DREAM',
    style: 'Rap',
    bpm: '85',
    key: 'C mayor',
    mood: 'Nostálgico',
    detailsLine: 'Rap · 85 BPM · C mayor · Nostálgico',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_DREAM_602435a3.png',
    audioUrl: 'audio/MUESTRA - DREAM.mp3',
    referenceDetail: 'Graffiti DREAM y soñador en cornisa',
    bgPosition: '35% 58%',
    bgSize: '135%'
  },
  {
    id: '15',
    trackNumber: '15',
    title: 'HUELLA',
    style: 'Rap',
    bpm: '90',
    key: 'E mayor',
    mood: 'Nostálgico',
    detailsLine: 'Rap · 90 BPM · E mayor · Nostálgico',
    hasExclusive: true,
    coverUrl: '/assets/aistudio/PORTADA_-_HUELLA_f7e24f35.png',
    audioUrl: 'audio/MUESTRA - HUELLA.mp3',
    referenceDetail: 'Graffiti HUELLA con farola y lluvia otoñal',
    bgPosition: '50% 50%',
    bgSize: '120%'
  }
];

export const NOTICE_PRICE_TEXT = {
  TITLE: 'AVISO:',
  FUTURE: 'EN UN FUTURO EL PRECIO SERÁ: ESENCIAL - 50€ / PREMIUM - 100€ / STEMS - 150€ / EXCLUSIVA 500€.',
  VALIDITY: 'PRECIOS ACTUALES HASTA EL 1 DE ENERO DE 2027.',
  FULL: 'AVISO: EN UN FUTURO EL PRECIO SERÁ: ESENCIAL - 50€ / PREMIUM - 100€ / STEMS - 150€ / EXCLUSIVA 500€.  PRECIOS ACTUALES HASTA EL 1 DE ENERO DE 2027.'
};

export interface LicensePlan {
  id: string;
  name: string;
  price: string;
  extraInfo?: string;
  description: string;
  descriptionPlaceholder?: string;
}

export const LICENSES: LicensePlan[] = [
  {
    id: 'esencial',
    name: 'Esencial',
    price: '29 €',
    description: 'Tu primer paso. MP3 listo para publicar en plataformas y redes. Licencia no exclusiva, sin límite de reproducciones. Crédito: Prod: Daga · LC WORLD.',
    descriptionPlaceholder: 'Tu primer paso. MP3 listo para publicar en plataformas y redes. Licencia no exclusiva, sin límite de reproducciones. Crédito: Prod: Daga · LC WORLD.'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '79 €',
    extraInfo: '(incluye WAV)',
    description: 'El favorito para sonar profesional. MP3 + WAV de alta calidad para publicar, distribuir y monetizar sin límite, con calidad para radio, TV y directo. Licencia no exclusiva. Crédito: Prod: Daga · LC WORLD.',
    descriptionPlaceholder: 'El favorito para sonar profesional. MP3 + WAV de alta calidad para publicar, distribuir y monetizar sin límite, con calidad para radio, TV y directo. Licencia no exclusiva. Crédito: Prod: Daga · LC WORLD.'
  },
  {
    id: 'stems',
    name: 'Stems',
    price: '179 €',
    description: 'Haz tuya la mezcla. MP3 + WAV + stems del beat (baterías, bajos, melodías) para trabajarlo a tu medida, con 2 revisiones incluidas. Licencia no exclusiva, sin límite de reproducciones. Crédito: Prod: Daga · LC WORLD.',
    descriptionPlaceholder: 'Haz tuya la mezcla. MP3 + WAV + stems del beat (baterías, bajos, melodías) para trabajarlo a tu medida, con 2 revisiones incluidas. Licencia no exclusiva, sin límite de reproducciones. Crédito: Prod: Daga · LC WORLD.'
  },
  {
    id: 'exclusiva',
    name: 'Exclusiva',
    price: '450 €',
    description: 'Este beat, solo tuyo. MP3 + WAV + trackouts completos y 3 revisiones. Se retira de la tienda al comprarlo, y tu canal queda autorizado a monetizar. Sin límite de reproducciones. Crédito: Prod: Daga · LC WORLD.',
    descriptionPlaceholder: 'Este beat, solo tuyo. MP3 + WAV + trackouts completos y 3 revisiones. Se retira de la tienda al comprarlo, y tu canal queda autorizado a monetizar. Sin límite de reproducciones. Crédito: Prod: Daga · LC WORLD.'
  }
];