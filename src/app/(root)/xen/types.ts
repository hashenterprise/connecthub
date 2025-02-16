export interface Interaction {
  id: number;
  query: string;
  response: string;
  type: 'text' | 'video' | 'file';
  status: 'loading' | 'complete' | 'error';
  timestamp: Date;
  mediaUrl?: string;
}