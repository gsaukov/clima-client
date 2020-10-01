
  export interface Lang {
    name: string;
    iso6391: string;
    iso6393: string;
    defaulted: boolean;
  }

  export interface ParsedText {
    city: string;
  }

  export interface Query {
    text: string;
    size: number;
    layers: string[];
    private: boolean;
    lang: Lang;
    querySize: number;
    parser: string;
    parsed_text: ParsedText;
  }

  export interface Engine {
    name: string;
    author: string;
    version: string;
  }

  export interface Geocoding {
    version: string;
    attribution: string;
    query: Query;
    engine: Engine;
    timestamp: number;
  }

  export interface Geometry {
    type: string;
    coordinates: number[];
  }

  export interface Properties {
    id: string;
    gid: string;
    layer: string;
    source: string;
    source_id: string;
    name: string;
    confidence: number;
    match_type: string;
    accuracy: string;
    country: string;
    country_gid: string;
    country_a: string;
    region: string;
    region_gid: string;
    region_a: string;
    macrocounty: string;
    macrocounty_gid: string;
    county: string;
    county_gid: string;
    county_a: string;
    locality: string;
    locality_gid: string;
    continent: string;
    continent_gid: string;
    label: string;
  }

  export interface Feature {
    type: string;
    geometry: Geometry;
    properties: Properties;
    bbox: number[];
  }

  export interface Geocode {
    geocoding: Geocoding;
    type: string;
    features: Feature[];
    bbox: number[];
  }



