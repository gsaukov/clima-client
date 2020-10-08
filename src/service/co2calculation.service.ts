import {Injectable} from "@angular/core";
import {Observable, of, zip} from "rxjs";
import {Direction} from "../rest/model/DirectionsInterfaces";
import {OpenrouteService} from "../rest/openroute.service";
import {CO2EmissionResponse} from "../rest/model/CO2EmissionResponse";
import {VehicleData} from "../rest/model/VehicleData";
import {map, switchMap} from "rxjs/operators";
import {RaildarService} from '../rest/raildar.service';
import {RailroadRoute} from '../rest/model/RailroadRoute';

@Injectable({
  providedIn: 'root'
})
export class Co2calculationService {

  private vehicles: VehicleData[] = [
    {vehicleId: 'small-diesel-car', co2EmissionGR: 142},
    {vehicleId: 'small-petrol-car', co2EmissionGR: 154},
    {vehicleId: 'small-plugin-hybrid-car', co2EmissionGR: 73},
    {vehicleId: 'small-electric-car', co2EmissionGR: 50},
    {vehicleId: 'medium-diesel-car', co2EmissionGR: 171},
    {vehicleId: 'medium-petrol-car', co2EmissionGR: 192},
    {vehicleId: 'medium-plugin-hybrid-car', co2EmissionGR: 110},
    {vehicleId: 'medium-electric-car', co2EmissionGR: 58},
    {vehicleId: 'large-diesel-car', co2EmissionGR: 209},
    {vehicleId: 'large-petrol-car', co2EmissionGR: 282},
    {vehicleId: 'large-plugin-hybrid-car', co2EmissionGR: 126},
    {vehicleId: 'large-electric-car', co2EmissionGR: 73},
    {vehicleId: 'bus', co2EmissionGR: 27},
    {vehicleId: 'train', co2EmissionGR: 6}
  ]

  constructor(private openRouteService: OpenrouteService,
              private raildarService: RaildarService) {
  }

  public getCo2Emission(start: string, end: string, vehicleId: string): Observable<CO2EmissionResponse> {
    const vehicleData: VehicleData = this.findVehicle(vehicleId)
    if(vehicleData.vehicleId === 'train'){
      return this.getCo2EmissionTrain(start, end, vehicleData)
    } else {
      return this.getCo2EmissionCar(start, end, vehicleData)
    }
  }

  private getCo2EmissionCar(start: string, end: string, vehicleData: VehicleData): Observable<CO2EmissionResponse> {
    const start$ = this.prepareCoordinate(start)
    const end$ = this.prepareCoordinate(end)
    const zipped$ = zip(start$, end$).pipe(
      switchMap(responses => {
        return this.openRouteService.getDirections(responses[0], responses[1])
      }),
      map(response => {
        return this.toCo2EmissionResponse(response, start, end, vehicleData)
      })
    )
    return zipped$
  }

  private getCo2EmissionTrain(start: string, end: string, vehicleData: VehicleData): Observable<CO2EmissionResponse> {
    const start$ = this.prepareCoordinate(start)
    const end$ = this.prepareCoordinate(end)
    const zipped$ = zip(start$, end$).pipe(
      switchMap(responses => {
        return this.raildarService.getRailroadRoute(responses[0], responses[1])
      }),
      map(response => {
        return this.toCo2EmissionResponseTrain(response, start, end, vehicleData)
      })
    )
    return zipped$
  }

  private findVehicle(vehicleId: string): VehicleData {
    return this.vehicles.find(x => x.vehicleId === vehicleId)
  }

  private prepareCoordinate(el: string): Observable<string> {
    if (this.isAlreadyCoordinate(el)) {
      return of(el)
    } else {
      return this.openRouteService.getCoordinates(el).pipe(
        map(response => {
          if (response.features[0]) {
            const coordinatesArr = response.features[0].geometry.coordinates
            return coordinatesArr[0].toString() + ',' + coordinatesArr[1].toString()
          } else {
            throw {message: 'not found: ' + el}
          }
        })
      )
    }
  }

  private isAlreadyCoordinate(el: string): boolean {
    var reg = new RegExp(/^(-?\d+\.\d+)(\s*,\s*-?\d+\.\d+)+$/)
    if (reg.test(el)) {
      return true
    } else {
      return false
    }
  }

  private toCo2EmissionResponse(response: Direction, start: string, end: string, vehicleData: VehicleData): CO2EmissionResponse {
    const distanceKM = response.features[0].properties.summary.distance / 1000
    const emissionKG = vehicleData.co2EmissionGR / 1000
    const co2EmissionResponse: CO2EmissionResponse = {
      co2EmissionKG: +(distanceKM * emissionKG).toFixed(3),
      distanceKM: +distanceKM.toFixed(3),
      end: end,
      routeGeometry: response.features[0].geometry.coordinates,
      start: start,
      vehicleData: vehicleData
    }
    return co2EmissionResponse
  }

  private toCo2EmissionResponseTrain(response: RailroadRoute, start: string, end: string, vehicleData: VehicleData): CO2EmissionResponse {
    const distanceKM = response.route_summary.total_distance / 1000
    const emissionKG = vehicleData.co2EmissionGR / 1000
    const co2EmissionResponse: CO2EmissionResponse = {
      co2EmissionKG: +(distanceKM * emissionKG).toFixed(3),
      distanceKM: +distanceKM.toFixed(3),
      end: end,
      routeGeometry: this.raildarService.decodeGeometry(response.route_geometry),
      start: start,
      vehicleData: vehicleData
    }
    return co2EmissionResponse
  }
}
