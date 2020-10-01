import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs";
import {CO2EmissionResponse} from './model/cO2EmissionResponse';


@Injectable({
  providedIn: 'root'
})
export class Co2emissionService {
  constructor(private http: HttpClient) {
  }

  calculateCO2(params: any): Observable<CO2EmissionResponse> {
    return this.http.get<CO2EmissionResponse>(`/api/v2/co2-calculator`,
      {
        params: new HttpParams({
          fromObject: params
        })
      }
    )
  }

}
