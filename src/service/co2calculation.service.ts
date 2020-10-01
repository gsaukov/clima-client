import {Injectable} from "@angular/core";
import {forkJoin, Observable, of, pipe, zip} from "rxjs";
import {Geocode} from "../rest/model/GeocodeInterfaces";
import {Direction} from "../rest/model/DirectionsInterfaces";
import {OpenrouteService} from "../rest/openroute.service";
import {CO2EmissionResponse} from "../rest/model/CO2EmissionResponse";
import {VehicleData} from "../rest/model/VehicleData";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class Co2calculationService {

  private vehicles: VehicleData[] = [
    {vehicleId: 'small-diesel-car', co2EmissionGR:	142	},
    {vehicleId: 'small-petrol-car', co2EmissionGR:	154	},
    {vehicleId: 'small-plugin-hybrid-car', co2EmissionGR:	73	},
    {vehicleId: 'small-electric-car', co2EmissionGR:	50	},
    {vehicleId: 'medium-diesel-car', co2EmissionGR:	171	},
    {vehicleId: 'medium-petrol-car', co2EmissionGR:	192	},
    {vehicleId: 'medium-plugin-hybrid-car', co2EmissionGR:	110	},
    {vehicleId: 'medium-electric-car', co2EmissionGR:	58	},
    {vehicleId: 'large-diesel-car', co2EmissionGR:	209	},
    {vehicleId: 'large-petrol-car', co2EmissionGR:	282	},
    {vehicleId: 'large-plugin-hybrid-car', co2EmissionGR:	126	},
    {vehicleId: 'large-electric-car', co2EmissionGR:	73	},
    {vehicleId: 'bus', co2EmissionGR:	27	},
    {vehicleId: 'train', co2EmissionGR:	6	}
  ]

  constructor(private openRouteService: OpenrouteService) {
  }

  public getCo2Emission(start: string, end: string, vehicleId: string): Observable<CO2EmissionResponse>{
    const vehicleData: VehicleData = this.findVehicle(vehicleId)
    let start$ = this.prepareCoordinate(start)
    let end$ = this.prepareCoordinate(end)
    zip(start$, end$)
      .pipe(map(responses => {
        this.openRouteService.getDirections(responses[0], responses[1]).pipe(
          map(response => {
            const co2EmissionResponse: CO2EmissionResponse = {
              co2EmissionKG: (response.features[0].properties.summary.distance * vehicleData.co2EmissionGR) / 1000,
              distanceKM: response.features[0].properties.summary.distance,
              end: end,
              routeGeometry: response.features[0].geometry.coordinates,
              start: start,
              vehicleData: vehicleData
            }
            return co2EmissionResponse;
          })
        ).subscribe()
      })
      ).subscribe(data => d)
  }

  private findVehicle(vehicleId: string): VehicleData{
    return this.vehicles.find(x => x.vehicleId === vehicleId);
  }

  private prepareCoordinate(el: string): Observable<string> {
    if (this.isAlreadyCoordinate(el)) {
       return this.getAsCoordinate(el)
    } else {
       return this.openRouteService.getCoordinates(el).pipe(
         map(response => {
           if(response.features){
             const coordinatesArr = response.features[0].geometry.coordinates
             return coordinatesArr[0].toString() + ',' + coordinatesArr[1].toString()
           } else {
             throw {message: 'not found: ' + el}
           }
         })
       )
    }
  }

  private getAsCoordinate(el: string): Observable<string> {
    const coordsArr: string[] = el.split(",").reverse()
    return of(coordsArr.toString())
  }

  private isAlreadyCoordinate(el: string):boolean {
    var reg = new RegExp(/^(-?\d+\.\d+)(\s*,\s*-?\d+\.\d+)+$/)
    if (  reg.test(el)) {
      return true;
    } else {
      return false;
    }
  }

  private getDirection (start:string, end:string, vehicleData: VehicleData) {
    return this.openRouteService.getDirections(start, end).pipe(map(response => {
        const co2EmissionResponse: CO2EmissionResponse = {
          co2EmissionKG: (response.features[0].properties.summary.distance * vehicleData.co2EmissionGR) / 1000,
          distanceKM: response.features[0].properties.summary.distance,
          end: end,
          routeGeometry: response.features[0].geometry.coordinates,
          start: start,
          vehicleData: vehicleData
        }
      return co2EmissionResponse;
    }))
  }

}
