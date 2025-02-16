// types/ExtendedCall.ts
import { Call } from '@stream-io/video-react-sdk';

export interface ExtendedCall extends Call {
  data?: {
    custom?: {
      description?: string;
      password?: string;
    };
    starts_at?: string;
    created_by?: string;
  };
}