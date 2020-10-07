import {Injectable} from '@angular/core';

declare var L: any

const DEFAULT_COORDINATE: number[] = [60.152126, 11.544467]
const DEFAULT_ZOOM = 8

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private layerGroup
  private map
  private routeLayer
  private myStyle = {
    'color': '#3949AB',
    'weight': 4,
    'opacity': 0.8
  }

  constructor() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords.longitude + ' ' + position.coords.latitude)
        this.map.setView([position.coords.latitude, position.coords.longitude], DEFAULT_ZOOM)
      },
        () => {},
        {timeout:10000})
    }
  }

  public renderMap(): void {
    this.layerGroup = new L.LayerGroup()
    this.map = L.map('map').setView(DEFAULT_COORDINATE, DEFAULT_ZOOM)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://gsaukov.netlify.app">Georgy Saukov</a>',
      maxZoom: 18,
    }).addTo(this.map)

    this.layerGroup.addTo(this.map)
  }

  public renderMapCo2Emission(routeGeometry?: Array<Array<number>>): void {
    var routeData = [{
      "type": "LineString",
      "coordinates": routeGeometry }]

    if(this.routeLayer){
      this.layerGroup.removeLayer(this.routeLayer)
    }

    this.routeLayer = L.geoJSON(routeData, {
      style: this.myStyle
    })

    this.layerGroup.addLayer(this.routeLayer)

    this.map.fitBounds(this.routeLayer.getBounds())
  }

  public setCoordinatesOnMapClick(el){
    const element = el
    element.value = ""
    element.dispatchEvent(new Event('input'))
    L.DomUtil.addClass(this.map._container,'crosshair-cursor-enabled')
    this.map.on('click', (e) => {
      element.value = (e.latlng.lng + "," + e.latlng.lat)
      element.dispatchEvent(new Event('input'))
      this.map.removeEventListener(e.type)
      L.DomUtil.removeClass(this.map._container,'crosshair-cursor-enabled')
    })
  }

}
