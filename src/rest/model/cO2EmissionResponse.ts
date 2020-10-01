import { VehicleData } from './vehicleData';


export interface CO2EmissionResponse {
    co2EmissionKG?: number;
    distanceKM?: number;
    end?: string;
    routeGeometry?: Array<Array<number>>;
    start?: string;
    vehicleData?: VehicleData;
}
