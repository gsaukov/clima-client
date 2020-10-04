# CLIMA Client - transport CO2 emission calculator.

CLIMA allows users calculate their CO2 emission based on their transportation-method(vehicle) and route distance.  
Route distance is calculated using openrouteservice.org directions and geocode API. User must provide "start" and "end" coordinates or alternatively city names and "vehicle".  
User can provide coordinates directly from the map by clicking on target icon and then clicking on the desired place on the map.  
Based on this information system will calculate: route path, distance and emitted CO2 value. All this information will be displayed on the map.

Application is available here:

https://co2calculator.netlify.app

### Components:
* TypeScript/JavaScript - core programming language.
* NPM - Package manager. Build automation.
* Angular 10 - Frontend framework.
* RxJS - Reactive/Asynchronous integration with backend. Observables, Subscriptions, Operators.
* HTML5 - Animations, effects, validations.
* SVG - Hand made decorations and icons.
* Leaflet - Interactive map, layers, GEO features.
* OpenStreetMap - Map tiles, visual content.
* OpenRouteService - Routing Data source.
* Netlify - Static hosting and build master https://netlify.app

### Build/Run steps

You will need NODE NPM

You can import it into your IDE as gradle project so you can review source code build/test it using IDE.

Or build/run it manually:

```sh
In clima-client folder run:
npm install
ng serve
```
this will start client on http://localhost:4200/

### Notes
1. Client is manually tested against Safari, Chrome, Firefox and should run fine in them.
2. Client might not work on smart phones.
3. Menu blur might cause some performance and blinking screen on slow machines.
