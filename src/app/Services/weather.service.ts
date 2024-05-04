import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { SearchDetails } from '../Models/SearchDetails';
import { TodayData } from '../Models/TodayData';
import { ForecastData } from '../Models/ForecastData';
import { TodaysHighlight } from '../Models/TodaysHighlights';
import { Observable, Subject } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';
import * as echarts from 'echarts';

@Injectable({
  providedIn: 'root'
})

//class to export weatherservice service
export class WeatherService {
  loading:boolean=true;
  echart:boolean=false;

  // Observable to subscribe to changes in todaysHighlight.hours
  private todaysHighlightHours: Subject<string[]> = new Subject<string[]>();
  private todaysHighlightMax_temps: Subject<number[]> = new Subject<number[]>();

  public todaysHighlight$: Observable<string[]> = this.todaysHighlightHours.asObservable();
  public todaysHighlightMax_temps$: Observable<number[]> = this.todaysHighlightMax_temps.asObservable();


  //variables to be used for API calls
  cityName:string = 'Guwahati';
  noOfDays:number = 3;
  dateParts:string[];
  currentTime:Date;
  currentDate:string;

  //variables which will be filled by API endpoints
  searchDetails?: SearchDetails;
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  //variables that have the extracted data from the API endpoint variables
  // todayData?: TodayData = new TodayData();
  // forecastData?: ForecastData[] = []
  // todaysHighlight?:TodaysHighlight = new TodaysHighlight();
  todayData?: TodayData = new TodayData();
  forecastData?: ForecastData[] = []
  todaysHighlight?:TodaysHighlight = new TodaysHighlight();
  formattedDate: string;

  constructor(private httpClient: HttpClient) {
    // this.getData();
   }

   //method to fill today's weather details
   fillTodayDetails(){
    this.currentTime = new Date();
    this.currentDate = this.locationDetails.location.localtime.slice(0,10);
    this.todayData.temperature = this.weatherDetails.current.temp_c;
    this.todayData.location = this.weatherDetails.location.name;
    this.todayData.summaryImage = this.weatherDetails.current.condition.icon;
    this.todayData.summaryPhrase = this.weatherDetails.current.condition.text;
    this.todayData.location = this.weatherDetails.location.name;
    
    this.dateParts = this.weatherDetails.location.localtime.slice(0,10).split('-');
    const year = parseInt(this.dateParts[0]);
    const month = parseInt(this.dateParts[1]);
    const day = parseInt(this.dateParts[2]);

    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    this.todayData.date = formattedDate;

    const timeString = this.weatherDetails.location.localtime.slice(11,16);
    const [hours,minutes] = timeString.split(':').map(Number);

    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);

    const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    this.todayData.time = formattedTime;
   }

   //3 days data
   threeDaysData(){
    var dayCount = 0;
    this.forecastData = [];

    while(dayCount < 3){
      this.forecastData.push(new ForecastData());
      this.forecastData[dayCount].date = this.weatherDetails.forecast.forecastday[dayCount].date;
      this.forecastData[dayCount].summaryImage = this.weatherDetails.forecast.forecastday[dayCount].day.condition.icon;
      this.forecastData[dayCount].summaryText = this.weatherDetails.forecast.forecastday[dayCount].day.condition.text;
      this.forecastData[dayCount].tempMax = this.weatherDetails.forecast.forecastday[dayCount].day.maxtemp_c;
      this.forecastData[dayCount].tempMin = this.weatherDetails.forecast.forecastday[dayCount].day.mintemp_c;
      dayCount++;
    }
   }

  //method to get today's highlight data
  fillTodaysHighlight(){
    this.todaysHighlight.humidity = this.weatherDetails.current.humidity;
    this.todaysHighlight.windSpeed = this.weatherDetails.current.wind_kph;
    this.todaysHighlight.windDirection = this.weatherDetails.current.wind_dir;
    this.todaysHighlight.visibility = this.weatherDetails.current.vis_km;
    this.todaysHighlight.pressure = this.weatherDetails.current.pressure_mb;
    this.todaysHighlight.uvIndex = this.weatherDetails.current.uv;
    this.todaysHighlight.sunrise = this.weatherDetails.forecast.forecastday[0].astro.sunrise;
    this.todaysHighlight.sunset = this.weatherDetails.forecast.forecastday[0].astro.sunset;
    this.todaysHighlight.uvIndex = this.weatherDetails.current.uv;
    this.todaysHighlight.rainfall = this.weatherDetails.forecast.forecastday[0].day.daily_chance_of_rain;
  }

  fillTodaysGraph(){
    this.todaysHighlight.hours = [];
    this.todaysHighlight.hourly_temp = [];
    console.log("humidity inside fill todays data",this.todaysHighlight.humidity);
      type EChartsOption = echarts.EChartsOption;
      var chartDom = document.getElementById('graph');
      console.log("value of chartdom",chartDom);
      var myChart = echarts.init(chartDom);
      console.log("value of mychart",myChart);
      var option: EChartsOption;
      for(let i=0; i<24; i++){
        const hourObject = this.weatherDetails.forecast.forecastday[0].hour[i];
  
        if(hourObject){
          this.todaysHighlight.hours.push(hourObject.time.slice(11,17));
          this.todaysHighlight.hourly_temp.push(hourObject.temp_c);
        } else {
          this.todaysHighlight.hours.push("N/A");
          this.todaysHighlight.hourly_temp.push(0);
        }
      }
      // debugger
      
      this.todaysHighlightHours.next(this.todaysHighlight.hours);
      this.todaysHighlightMax_temps.next(this.todaysHighlight.hourly_temp);
  
      this.todaysHighlight$.subscribe(hours => {
        console.log("graph started");
        
        if(hours){
          this.todaysHighlightMax_temps$.subscribe(maxTemps => {
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
  }

   //method to create useful data chunks for UI using the data received from the API
   prepareData():void{
    console.log(" inside prepareData");
    
    console.log("today details called");
    this.fillTodayDetails();
    console.log("today details filled");

    console.log("three days called");
    this.threeDaysData();
    console.log("three days filled");

    console.log("highlights called");
    this.fillTodaysHighlight();
    console.log("highlights filled");

    console.log("graph called");
    this.fillTodaysGraph();
    console.log("graph filled");

   }

   //method to get location details from the API using the variable cityName as the Input
  getSearchDetails(cityName:string):Observable<SearchDetails>{
    return this.httpClient.get<SearchDetails>(EnvironmentalVariables.weatherApiSearchBaseUrl,{
      headers: new HttpHeaders().set(EnvironmentalVariables.ApiKeyName, EnvironmentalVariables.ApiKeyValue),
      params: new HttpParams().set('q',cityName)
    })
  }

//method to get location details from the API using the variable cityName as the Input
  getLocationDetails(cityName:string):Observable<LocationDetails>{
    return this.httpClient.get<LocationDetails>(EnvironmentalVariables.weatherApiLocationBaseUrl,{
      headers: new HttpHeaders().set(EnvironmentalVariables.ApiKeyName, EnvironmentalVariables.ApiKeyValue),
      params: new HttpParams().set('q',cityName)
    })
  }

  //method to get forecast details from the API using the variables cityName and noOfDays as the Input
  getForecastReport(cityName:string, noOfDays:number):Observable<WeatherDetails>{
    return this.httpClient.get<WeatherDetails>(EnvironmentalVariables.weatherApiForecastBaseUrl,{
      headers: new HttpHeaders().set(EnvironmentalVariables.ApiKeyName, EnvironmentalVariables.ApiKeyValue),
      params: new HttpParams().set('q',cityName).set('days',noOfDays)
    })
  }

  getData(){
    console.log("Entered get data");
    
    this.forecastData = [];
    this.todayData = new TodayData();
    this.todaysHighlight = new TodaysHighlight();

    this.getLocationDetails(this.cityName).subscribe({
      next:(response)=>{
        console.log("inside get location details");
        this.locationDetails = response;
        console.log("Location details are",this.locationDetails);
        this.getForecastReport(this.cityName, this.noOfDays).subscribe({
          next:(response)=>{
            console.log("inside get weather details");
            this.weatherDetails = response;
            // console.log(this.cityName,this.noOfDays);
            console.log("weather details are",this.weatherDetails);
            console.log("before prepare data");
            this.prepareData();
            console.log("after prepare data");
          }
        })
      }
    })}

    // this.getSearchDetails(this.cityName).subscribe({
    //   next:(response)=>{
    //     console.log("city name is",this.cityName);
    //     this.searchDetails = response;
    //     console.log("Search details are",this.searchDetails);
    //     this.getLocationDetails(this.cityName).subscribe({
    //       next:(response)=>{
    //         this.locationDetails = response;
    //         console.log("Location details are",this.locationDetails);
    //       }
    //     })
    //     this.getForecastReport(this.cityName, this.noOfDays).subscribe({
    //       next:(response)=>{
    //         this.weatherDetails = response;
    //         console.log(this.cityName,this.noOfDays);
    //         console.log("weather details are",this.weatherDetails);
    //         this.prepareData();
    //       }
    //     })
    //   }
    // })
  // }
  }
