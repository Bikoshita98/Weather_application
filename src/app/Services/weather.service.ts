import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { Weekdata } from '../Models/WeekData';
import { TodaysHighlight } from '../Models/TodaysHighlights';
import { Observable } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  cityName:string = 'Guwahati';
  noOfDays:number = 4;
  dateParts:string[];
  currentTime:Date;
  currentDate:string;

  //variables which will be filled by API endpoints
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  //variables that have the extracted data from the API endpoint variables
  // temperatureData: TemperatureData = new TemperatureData();
  temperatureData: TemperatureData;
  todayData?: TodayData[] = [];
  weekData?: Weekdata[] = []
  todaysHighlight?:TodaysHighlight = new TodaysHighlight();
  formattedDate: string;


  constructor(private httpClient: HttpClient) {
    this.getData();
   }

   fillTemperatureDataModel(){
    this.currentTime = new Date();
    // this.currentDate = this.weatherDetails.forecast.forecastday[0].date;
    this.currentDate = this.weatherDetails.forecast.forecastday[0].date;
    this.temperatureData.temperature = this.weatherDetails.current.temp_c;
    this.temperatureData.location = this.weatherDetails.location.name;
    this.temperatureData.summaryImage = this.weatherDetails.current.condition.icon;
    this.temperatureData.summaryPhrase = this.weatherDetails.current.condition.text;
    this.temperatureData.location = this.weatherDetails.location.name;
    
    this.dateParts = this.weatherDetails.location.localtime.slice(0,10).split('-');
    const year = parseInt(this.dateParts[0]);
    const month = parseInt(this.dateParts[1]);
    const day = parseInt(this.dateParts[2]);

    const date1 = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object
    const formattedDate = date1.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    console.log("formattedDate",formattedDate);
    // this.temperatureData.date = this.weatherDetails.location.localtime.slice(0,10);
    this.temperatureData.date = formattedDate;

    const timeString = this.weatherDetails.location.localtime.slice(11,16);
    const [hours,minutes] = timeString.split(':').map(Number);

    const date2 = new Date();
    date2.setHours(hours);
    date2.setMinutes(minutes);

    const formattedTime = date2.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // this.temperatureData.time = this.weatherDetails.location.localtime.slice(10,16);
    this.temperatureData.time = formattedTime;
   }

   //3 days data
   threeDaysData(){
    var weekCount = 0;

    while(weekCount < 3){
      this.weekData.push(new Weekdata());
      this.weekData[weekCount].date = this.weatherDetails.forecast.forecastday[weekCount].date;
      this.weekData[weekCount].summaryImage = this.weatherDetails.forecast.forecastday[weekCount].day.condition.icon;
      this.weekData[weekCount].summaryText = this.weatherDetails.forecast.forecastday[weekCount].day.condition.text;
      this.weekData[weekCount].tempMax = this.weatherDetails.forecast.forecastday[weekCount].day.maxtemp_c;
      this.weekData[weekCount].tempMin = this.weatherDetails.forecast.forecastday[weekCount].day.mintemp_c;
      weekCount++;
    }
   }

   fillTodayData(){
    var todayCount = 0;

    while(todayCount < 3){
    this.todayData.push(new TodayData());
    // this.todayData[todayCount].tempMax = this.weatherDetails.forecast.forecastday[0].day.maxtemp_c;
    // this.todayData[todayCount].tempMin = this.weatherDetails.forecast.forecastday[0].day.mintemp_c;
      this.todayData[todayCount].time = this.weatherDetails.forecast.forecastday[0].hour[0].time.slice(11,16).toString();
      todayCount++;
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

   //method to create useful data chunks for UI using the data received from the API
   prepareData():void{
    this.fillTemperatureDataModel();
    this.threeDaysData();
    this.fillTodayData();
    this.fillTodaysHighlight();
    console.log("hello biko");
    console.log(this.temperatureData);
    console.log(this.weekData);
    console.log(this.todayData);
   }


   //method to get location details from the API using the variable cityName as the Input

  getLocationDetails(cityName:string):Observable<LocationDetails>{
    return this.httpClient.get<LocationDetails>(EnvironmentalVariables.weatherApiForecastBaseUrl,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName, EnvironmentalVariables.xRapidApiKeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName, EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('q',cityName)

    })
  }

  //method to get forecast details from the API using the variables cityName and noOfDays as the Input
  
  getWeatherReport(cityName:string, noOfDays:number):Observable<WeatherDetails>{
    return this.httpClient.get<WeatherDetails>(EnvironmentalVariables.weatherApiForecastBaseUrl,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName, EnvironmentalVariables.xRapidApiKeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName, EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('q',cityName)
      .set('days',noOfDays)
    })
  }

  getData(){
    this.todayData = [];
    this.weekData = [];
    this.temperatureData = new TemperatureData();
    this.todaysHighlight = new TodaysHighlight();

    this.getLocationDetails(this.cityName).subscribe({
      next:(response)=>{
        this.locationDetails = response;
        console.log(this.locationDetails);
        this.prepareData();
      }
    })

    this.getWeatherReport(this.cityName, this.noOfDays).subscribe({
      next:(response)=>{
        this.weatherDetails = response;
        console.log(this.cityName,this.noOfDays);
        console.log(this.weatherDetails);
        this.prepareData();
      }
    })
    
  }
}
