import { type Interaction } from '@prisma/client'

export type Timezone = `-${number}${number}${number}${number}` | `+${number}${number}${number}${number}`;

// export interface Interaction {
//   id: number;
//   datetime: string;
//   timezone: Timezone;
//   quotes: string[];
//   lat: number;
//   lon: number;
//   photoID?: string;
//   description?: string;
//   cachedCity?: string;
//   cachedState?: string;
//   cachedPhotoAspectRatio?: number;
// }

export type InteractionResult = Omit<Interaction, 'lat' | 'lng' | 'cachedPhotoAspectRatio'> & {
  photoURL?: string;
  cachedPhotoAspectRatio?: number
}
