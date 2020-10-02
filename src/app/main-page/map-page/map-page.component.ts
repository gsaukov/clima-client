import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from '../../../service/map.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OpenrouteService} from '../../../rest/openroute.service';
import {CO2EmissionResponse} from '../../../rest/model/CO2EmissionResponse';
import {Subscription} from 'rxjs';
import {Co2calculationService} from "../../../service/co2calculation.service";

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  aSub: Subscription
  resp: CO2EmissionResponse
  loading: boolean = false
  errorMessage: string = null

  constructor(private mapService: MapService,
              private co2calculationService: Co2calculationService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
      "transportation-method": new FormControl(null, [Validators.required])
    })
    this.mapService.renderMap();
  }

  ngOnDestroy(): void {
    if(this.aSub){
      this.aSub.unsubscribe() //free memory
    }
  }

  onSubmit() {
    this.loading = true
    this.form.disable()
    this.resp = null
    this.errorMessage = null
    this.co2calculationService.getCo2Emission(this.form.controls['start'].value,
                                              this.form.controls['end'].value,
                                              this.form.controls['transportation-method'].value)
      .subscribe(
      (cO2EmissionResponse : CO2EmissionResponse) =>
              {
                debugger
                this.resp = cO2EmissionResponse;
                this.mapService.renderMapCo2Emission(cO2EmissionResponse.routeGeometry);
                this.form.enable()
                this.loading = false
              },
              (e) =>
              {
                console.log(e)
                this.form.enable()
                this.loading = false
                this.errorMessage = e.error
              }
            )
  }

  subscribeForCoordinates(el) {
    this.mapService.setCoordinatesOnMapClick(el)
  }

}
