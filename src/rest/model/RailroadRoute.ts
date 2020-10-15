export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface RailroadRoute {
  type: string;
  geometry: Geometry;
}
