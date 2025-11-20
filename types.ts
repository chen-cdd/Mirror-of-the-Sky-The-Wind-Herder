export enum LocationType {
  MIRROR_VOID = 'Mirror Void (Salt Lake)',
  WHISPERING_GRASS = 'Whispering Grass (Endless Plains)',
  ERODED_RUINS = 'Eroded Tech (Megastructure Ruins)'
}

export interface LoreEntry {
  id: string;
  text: string;
  location: LocationType;
  timestamp: number;
}

export interface WindState {
  speed: number;
  direction: [number, number, number]; // x, y, z
}
