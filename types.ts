
export type ContentType = 'text' | 'image' | 'video' | 'audio' | 'social';

export interface BandContent {
  id: string;
  type: ContentType;
  title: string;
  content: string; // URL for image/video/audio, or actual text for text blocks, or link for social
  metadata?: string; // Subtitle, extra info, or social platform name
}

export interface TourDate {
  id: string;
  venue: string;
  location: string;
  date: string;
  ticketsUrl?: string;
}
