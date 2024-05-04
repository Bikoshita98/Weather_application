import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WeatherService } from '../Services/weather.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.scss']
})

// export class WeatherContainerComponent implements OnInit {
  // export class WeatherContainerComponent implements OnChanges{
  // // dataLoaded: boolean = false;
  // location: any;
  // constructor(public weatherService:WeatherService){}
  
  // ngOnChanges(changes:SimpleChanges) {
    
  //   console.log("onInit");
  //   if(changes['weatherService'])
  //     console.log(this.weatherService.loading);
      
  //   this.weatherService.getData(); // Fetch data from the WeatherService
  //   console.log(this.weatherService.loading);

  //   type EChartsOption = echarts.EChartsOption;
  //   console.log("biko1");
    
  //   var chartDom = document.getElementById('graph');
  //   console.log("biko2");

  //   var myChart = echarts.init(chartDom);
  //   var option: EChartsOption;

  //   // Subscribe to changes in the weatherService.todaysHighlight.hours

  //   this.weatherService.todaysHighlight$.subscribe(hours => {
  //     if(hours){
  //       this.weatherService.todaysHighlightMax_temps$.subscribe(maxTemps => {
  //         if (maxTemps) {
  //       option = {
  //         xAxis: {
  //           type: 'category',
  //           data: hours
  //         },
  //         yAxis: {
  //           type: 'value'
  //         },
  //         series: [
  //           {
  //             // data: [820, 932, 901, 934, 1290, 1330, 1320],
  //             data: maxTemps,
  //             type: 'line',
  //             smooth: true
  //           }
  //         ]
  //       };
    
  //       option && myChart.setOption(option);
  //       // this.dataLoaded = true;
  //     }})}
  //   })

  //   // throw new Error('Method not implemented.');
  // }
  //   onSearch(location:string){
  //     this.weatherService.cityName = location;
  //     this.weatherService.getData();
  //   }
  // }

  export class WeatherContainerComponent implements OnInit {

    location: any;
    constructor(public weatherService:WeatherService){}
    
    ngOnInit(): void {
      
      this.weatherService.getData();

      type EChartsOption = echarts.EChartsOption;
      var chartDom = document.getElementById('graph');
      console.log("value of chartdom",chartDom);
      var myChart = echarts.init(chartDom);
      console.log("value of mychart",myChart);
      var option: EChartsOption;

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
              data: maxTemps,
              type: 'line',
              smooth: true
            }
          ]
        };
    
        option && myChart.setOption(option);
      }})}
    })
  }
    onSearch(location:string){
      this.weatherService.cityName = location;
      this.weatherService.getData();
    }
  }
