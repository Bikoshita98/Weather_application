import { Component } from '@angular/core';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.scss']
})


export class WeatherContainerComponent {
  constructor(public weatherService:WeatherService){}
}
