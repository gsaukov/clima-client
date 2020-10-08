import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {RailroadRoute} from './model/RailroadRoute';

const API_URL = 'http://raildar.fr'

@Injectable({
  providedIn: 'root'
})
export class RaildarService {

  constructor(private http: HttpClient) {
  }

  getRailroadRoute(start: string, end: string): Observable<RailroadRoute> {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    let options = { headers: headers };
    return this.http.get<RailroadRoute>(`${API_URL}/osrm-engine/viaroute?z=18&output=json&alt=false&loc=${start}&loc=${end}`, options)
  }

  decodeGeometry(geom) {
    var b;
    var delta;
    var lat = 0, lng = 0;
    var res, shift;
    var out = "";
    var latlngs = []
    var i = 0;
    while (i < geom.length) {
      res = 0; shift = 0;
      do {
        b = geom.charCodeAt(i++) - 63;
        res |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      delta = res >> 1;
      if (res & 1) delta = ~delta
      lat += delta;

      res = 0; shift = 0;
      do {
        b = geom.charCodeAt(i++) - 63;
        res |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      delta = res >> 1;
      if (res & 1) delta = ~delta
      lng += delta;
      console.log(lat/1e6)
      console.log(lng/1e6)
      latlngs.push([lat/1e6, lng/1e6]);
    }
    return latlngs
  }
}
