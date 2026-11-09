
export interface Beat {
  id: string;
  title: string;
  bpm: number;
  key: string;
  price: number;
  tags: string[];
  coverUrl: string;
  audioUrl: string; // Preview MP3 (Tagged)
  downloadUrl?: string; // MP3 Lease (Untagged)
  wavUrl?: string; // WAV Lease
  stemsUrl?: string; // Stems/Trackout
  producer: string;
}

export interface CartItem extends Beat {
  licenseType: 'MP3 Lease' | 'WAV Lease' | 'Unlimited';
}

export enum LicenseType {
  MP3 = 'MP3 Lease',
  WAV = 'WAV Lease',
  UNLIMITED = 'Unlimited'
}

export const LICENSE_PRICES = {
  [LicenseType.MP3]: 29.99,
  [LicenseType.WAV]: 49.99,
  [LicenseType.UNLIMITED]: 199.99,
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
