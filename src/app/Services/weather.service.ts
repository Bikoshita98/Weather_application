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


@Injectable({
  providedIn: 'root',
})

//class to export weatherservice service
export class WeatherService {
  location_present: boolean;

  // Observable to subscribe to changes in todaysHighlight.hours
  private todaysHighlightHours: Subject<string[]> = new Subject<string[]>();
  private todaysHighlightMax_temps: Subject<number[]> = new Subject<number[]>();

  public todaysHighlight$: Observable<string[]> =
    this.todaysHighlightHours.asObservable();
  public todaysHighlightMax_temps$: Observable<number[]> =
    this.todaysHighlightMax_temps.asObservable();

  //variables to be used for API calls
  cityName: string = 'Guwahati';
  noOfDays: number = 3;
  dateParts: string[];
  currentTime: Date;
  currentDate: string;

  //variables which will be filled by API endpoints
  searchDetails?: SearchDetails;
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  //variables that have the extracted data from the API endpoint variables
  todayData?: TodayData = new TodayData();
  forecastData?: ForecastData[] = [];
  todaysHighlight?: TodaysHighlight = new TodaysHighlight();
  formattedDate: string;

  constructor(private httpClient: HttpClient) {}

  //method to fill today's weather details
  fillTodayDetails() {
    this.currentTime = new Date();
    this.currentDate = this.weatherDetails.location.localtime.slice(0, 10);
    this.todayData.city = this.weatherDetails.location.name;
    this.todayData.region = this.weatherDetails.location.region;
    this.todayData.country = this.weatherDetails.location.country;
    this.todayData.temperature = this.weatherDetails.current.temp_c;
    this.todayData.summaryImage = this.weatherDetails.current.condition.icon;
    this.todayData.summaryPhrase = this.weatherDetails.current.condition.text;

    this.dateParts = this.weatherDetails.location.localtime
      .slice(0, 10)
      .split('-');
    const year = parseInt(this.dateParts[0]);
    const month = parseInt(this.dateParts[1]);
    const day = parseInt(this.dateParts[2]);

    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object
    const formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    this.todayData.date = formattedDate;

    const timeString = this.weatherDetails.location.localtime.slice(11, 16);
    const [hours, minutes] = timeString.split(':').map(Number);

    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);

    const formattedTime = time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    this.todayData.time = formattedTime;
  }

  //3 days data
  threeDaysData() {
    var dayCount = 0;
    this.forecastData = [];

    while (dayCount < 3) {
      this.forecastData.push(new ForecastData());
      this.forecastData[dayCount].date =
        this.weatherDetails.forecast.forecastday[dayCount].date;
      this.forecastData[dayCount].summaryImage =
        this.weatherDetails.forecast.forecastday[dayCount].day.condition.icon;
      this.forecastData[dayCount].summaryText =
        this.weatherDetails.forecast.forecastday[dayCount].day.condition.text;
      this.forecastData[dayCount].tempMax =
        this.weatherDetails.forecast.forecastday[dayCount].day.maxtemp_c;
      this.forecastData[dayCount].tempMin =
        this.weatherDetails.forecast.forecastday[dayCount].day.mintemp_c;
      dayCount++;
    }
  }

  //method to get today's highlight data
  fillTodaysHighlight() {
    this.todaysHighlight.humidity = this.weatherDetails.current.humidity;
    this.todaysHighlight.windSpeed = this.weatherDetails.current.wind_kph;
    this.todaysHighlight.windDirection = this.weatherDetails.current.wind_dir;
    this.todaysHighlight.visibility = this.weatherDetails.current.vis_km;
    this.todaysHighlight.pressure = this.weatherDetails.current.pressure_mb;
    this.todaysHighlight.uvIndex = this.weatherDetails.current.uv;
    this.todaysHighlight.sunrise =
      this.weatherDetails.forecast.forecastday[0].astro.sunrise;
    this.todaysHighlight.sunset =
      this.weatherDetails.forecast.forecastday[0].astro.sunset;
    this.todaysHighlight.uvIndex = this.weatherDetails.current.uv;
    this.todaysHighlight.rainfall =
      this.weatherDetails.forecast.forecastday[0].day.daily_chance_of_rain;
  }

  //method to get today's graph
  fillTodaysGraph() {
    this.todaysHighlight.hours = [];
    this.todaysHighlight.hourly_temp = [];

    for (let i = 0; i < 24; i++) {
      const hourObject = this.weatherDetails.forecast.forecastday[0].hour[i];

      if (hourObject) {
        this.todaysHighlight.hours.push(hourObject.time.slice(11, 17));
        this.todaysHighlight.hourly_temp.push(hourObject.temp_c);
      } else {
        this.todaysHighlight.hours.push('N/A');
        this.todaysHighlight.hourly_temp.push(0);
      }
    }

    this.todaysHighlightHours.next(this.todaysHighlight.hours);
    this.todaysHighlightMax_temps.next(this.todaysHighlight.hourly_temp);

  }

  //method to create useful data chunks for UI using the data received from the API
  prepareData(): void {
    this.fillTodayDetails();
    this.threeDaysData();
    this.fillTodaysHighlight();
    this.fillTodaysGraph();
  }

  //method to get location details from the API using the variable cityName as the Input
  getSearchDetails(cityName: string): Observable<SearchDetails> {
    return this.httpClient.get<SearchDetails>(
      EnvironmentalVariables.weatherApiSearchBaseUrl,
      {
        headers: new HttpHeaders().set(
          EnvironmentalVariables.ApiKeyName,
          EnvironmentalVariables.ApiKeyValue
        ),
        params: new HttpParams().set('q', cityName),
      }
    );
  }

  //method to get location details from the API using the variable cityName as the Input
  getLocationDetails(cityName: string): Observable<LocationDetails> {
    return this.httpClient.get<LocationDetails>(
      EnvironmentalVariables.weatherApiLocationBaseUrl,
      {
        headers: new HttpHeaders().set(
          EnvironmentalVariables.ApiKeyName,
          EnvironmentalVariables.ApiKeyValue
        ),
        params: new HttpParams().set('q', cityName),
      }
    );
  }

  //method to get forecast details from the API using the variables cityName and noOfDays as the Input
  getForecastReport(
    cityName: string,
    noOfDays: number
  ): Observable<WeatherDetails> {
    return this.httpClient.get<WeatherDetails>(
      EnvironmentalVariables.weatherApiForecastBaseUrl,
      {
        headers: new HttpHeaders().set(
          EnvironmentalVariables.ApiKeyName,
          EnvironmentalVariables.ApiKeyValue
        ),
        params: new HttpParams().set('q', cityName).set('days', noOfDays),
      }
    );
  }


  getData() {
    this.forecastData = [];
    this.todayData = new TodayData();
    this.todaysHighlight = new TodaysHighlight();
    this.location_present = true;

    this.getLocationDetails(this.cityName).subscribe({
      next: (response) => {
        this.locationDetails = response;

        this.getForecastReport(this.cityName, this.noOfDays).subscribe({
          next: (response) => {
            this.weatherDetails = response;
            this.prepareData();
          },
        });
      },
      error: (err) => {

        if (err.error && err.error.error.code === 1006) {
          this.location_present = false;
        } else {
          console.error('An unexpected error occurred:', err);
        }
      },
    });
  }
}
