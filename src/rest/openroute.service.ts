import { environment } from '../environments/environment';
import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {Geocode} from "./model/GeocodeInterfaces";
import {Direction} from "./model/DirectionsInterfaces";

const API_URL = 'https://api.openrouteservice.org'
const API_KEY = environment.API_KEY

@Injectable({
  providedIn: 'root'
})
export class OpenrouteService {

  constructor(private http: HttpClient) {
  }

  getCoordinates(cityName: string): Observable<Geocode> {
    return this.http.get<Geocode>(`${API_URL}/geocode/search?api_key=${API_KEY}&text=${cityName}&layers=locality&size=1`)
  }

  getDirections(start: string, end: string): Observable<Direction> {
    return this.http.get<Direction>(`${API_URL}/v2/directions/driving-car?api_key=${API_KEY}&start=${start}&end=${end}`)
  }
}
