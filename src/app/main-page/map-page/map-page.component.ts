import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from '../../../service/map.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Co2emissionService} from '../../../rest/co2emission.service';
import {CO2EmissionResponse} from '../../../rest/model/cO2EmissionResponse';
import {Subscription} from 'rxjs';

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
              private co2emissionService: Co2emissionService) { }

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
    this.aSub = this.co2emissionService.calculateCO2(this.form.value).subscribe(
      (cO2EmissionResponse : CO2EmissionResponse) =>
      {
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
