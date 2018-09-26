import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiWeatherPath : string = "http://localhost:41579/weather/city/";

  constructor(private _http: HttpClient) {
    
   }

  getForeCast(cityId,unit,dateStart,dateEnd){
        return this._http.get(this.apiWeatherPath + cityId + "/" + unit + "/" + dateStart + "/" + dateEnd)
          .map(result => result);
  }

}
