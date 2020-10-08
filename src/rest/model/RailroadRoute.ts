 export interface RouteSummary {
    total_distance: number;
    total_time: number;
    start_point: string;
    end_point: string;
  }

  export interface HintData {
    checksum: number;
    locations: string[];
  }

  export interface RailroadRoute {
    version: number;
    status: number;
    status_message: string;
    route_geometry: string;
    route_instructions: any[];
    route_summary: RouteSummary;
    alternative_geometries: any[];
    alternative_instructions: any[];
    alternative_summaries: any[];
    route_name: string[];
    alternative_names: string[][];
    via_points: number[][];
    hint_data: HintData;
    transactionId: string;
  }
