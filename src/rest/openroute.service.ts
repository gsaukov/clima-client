import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs";
import {CO2EmissionResponse} from './model/CO2EmissionResponse';
import {Geocode} from "./model/GeocodeInterfaces";
import {Direction} from "./model/DirectionsInterfaces";


@Injectable({
  providedIn: 'root'
})
export class OpenrouteService {

  constructor(private http: HttpClient) {
  }

  getCoordinates(cityName: string): Observable<Geocode> {
    return this.http.get<Geocode>(`https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248e4ee90a079ff4fb5ac6745be191eaf07&text=${cityName}&layers=locality&size=1`)
  }

  getDirections(start: string, end: string): Observable<Direction> {
    return this.http.get<Direction>(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248e4ee90a079ff4fb5ac6745be191eaf07&start=${start}&end=${end}`)
  }
}
