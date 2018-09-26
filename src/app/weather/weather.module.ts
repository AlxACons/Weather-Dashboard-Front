import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';

@NgModule({
  imports: [
    CommonModule,
    WeatherService
  ],
  providers: [WeatherService],
  declarations: []
})
export class WeatherModule { }
