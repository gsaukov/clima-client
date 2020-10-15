import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RailroadRoute} from './model/RailroadRoute';

declare var L;

const API_URL = 'https://trainmap.ntag.fr/api';

//rework with https://github.com/NTag/trainmap

@Injectable({
  providedIn: 'root'
})
export class TrainmapService {

  constructor(private http: HttpClient) {
  }

  getRailroadRoute(start: string, end: string): Observable<RailroadRoute> {
    var dep = this.toCoordinate(start)
    var arr = this.toCoordinate(end)
    console.log(dep + '-' + arr)
    return this.http.get<RailroadRoute>(`${API_URL}/route?dep=${dep}&arr=${arr}`);
  }

  calculateRouteDistance(route: number[][]): number {
    let distance: number = 0;
    for (let i = 1; i < route.length; i++) {
      distance += this.getDistance(route[i-1], route[i]);
    }
    return distance;
  }

  getDistance(origin: number[], destination: number[]): number {
    // return distance in meters
    var lon1 = this.toRadian(origin[1]),
      lat1 = this.toRadian(origin[0]),
      lon2 = this.toRadian(destination[1]),
      lat2 = this.toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  }

  toRadian(degree) {
    return degree * Math.PI / 180;
  }

  toCoordinate(text: string): string {
    var lat = this.pad(text.split(',')[1], 18)
    var lon = this.pad(text.split(',')[0], 18)
    return lat + ',' + lon
  }

  pad(num, size): string {
    let s = num+"";
    while (s.length < size) s = s + '5';
    return s;
  }
}

// https://trainmap.ntag.fr/api/route?dep=48.152126555555555,11.544467555555555&arr=55.741469555555555,37.615561555555555
// https://trainmap.ntag.fr/api/route?dep=48.147349693979665,11.582234501838686&arr=48.806726471119454,9.2036944627761865
