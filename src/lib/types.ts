export interface Interaction {
  id: number;
  datetime: string;
  quotes: string[];
  lat: number;
  lon: number;
  photoID?: string;
  description?: string;
}

export interface InteractionResult extends Interaction {
  photoURL?: string;
}
