import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from '../../../service/map.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CO2EmissionResponse} from '../../../rest/model/CO2EmissionResponse';
import {Subscription} from 'rxjs';
import {Co2calculationService} from "../../../service/co2calculation.service";

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent implements OnInit, OnDestroy {

  targetIcon: string = 'target.svg'
  targetIconActive: string = 'target-active.svg'

  form: FormGroup
  aSub: Subscription
  resp: CO2EmissionResponse
  loading: boolean = false
  errorMessage: string = null
  startTargetIcon: string = this.targetIcon
  endTargetIcon: string = this.targetIcon

  constructor(private mapService: MapService,
              private co2calculationService: Co2calculationService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
      "transportation-method": new FormControl(null, [Validators.required])
    })
    this.mapService.renderMap()
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
                this.resp = cO2EmissionResponse
                this.mapService.renderMapCo2Emission(cO2EmissionResponse.routeGeometry)
                this.form.enable()
                this.loading = false
              },
              (e) =>
              {
                this.form.enable()
                this.loading = false
                if(e.error?.error?.message){
                  this.errorMessage = e.error.error.message
                } else {
                  this.errorMessage = e.message
                }
              }
            )
  }

  subscribeForCoordinates(el) {
    this.mapService.setCoordinatesOnMapClick(el)
  }

  async startTargetIconBlink() {
    this.startTargetIcon = this.targetIconActive
    await this.delay(2000)
    this.startTargetIcon = this.targetIcon
  }

  async endTargetIconBlink() {
    this.endTargetIcon = this.targetIconActive
    await this.delay(2000)
    this.endTargetIcon = this.targetIcon
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
