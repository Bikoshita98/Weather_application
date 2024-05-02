import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../Services/weather.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.scss']
})


// export class WeatherContainerComponent {
// location: any;
//   constructor(public weatherService:WeatherService){}
//   onSearch(location:string){
//     this.weatherService.cityName = location;
//     this.weatherService.getData();
//   }
// }

export class WeatherContainerComponent implements OnInit {
  location: any;
    constructor(public weatherService:WeatherService){}

  ngOnInit(): void {
    this.weatherService.getData(); // Fetch data from the WeatherService

    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('graph')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;

    // Subscribe to changes in the weatherService.todaysHighlight.hours

    this.weatherService.todaysHighlight$.subscribe(hours => {
      if(hours){
        this.weatherService.todaysHighlightMax_temps$.subscribe(maxTemps => {
          if (maxTemps) {
        option = {
          xAxis: {
            type: 'category',
            data: hours
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              // data: [820, 932, 901, 934, 1290, 1330, 1320],
              data: maxTemps,
              type: 'line',
              smooth: true
            }
          ]
        };
    
        option && myChart.setOption(option);
      }})}
    })

    throw new Error('Method not implemented.');
  }
    onSearch(location:string){
      this.weatherService.cityName = location;
      this.weatherService.getData();
    }
  }
