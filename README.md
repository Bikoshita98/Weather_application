
# Project Title

This is an Angular-based interactive weather dashboard which allows users to search for and view current weather conditions and a three-day forecast for any selected location.
## Installation

Dependencies - 

```bash
NodeJs
Angular version 16.1.6
```

    
## Run Locally

Clone the project

```bash
  git clone https://github.com/Bikoshita98/Weather_application.git
```

Go to the project directory

```bash
  cd Weather_application
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  ng serve
```


## Documentation

[Documentation](https://linktodocumentation)

**Project Overview:**
The project is a Weather Dashboard web application developed using the Angular framework. It provides users with real-time weather information, including current weather conditions, forecasts for the next three days, and various weather highlights.

**Components:**

App Component: The root component of the application, responsible for rendering the overall layout and managing the navigation.

Weather Container Component: This component displays the main weather information, including today's summary, a graph showing hourly temperature changes, and the forecast for the next three days.

Services:
Weather Service: This service handles the interaction with the weather API. It retrieves data such as location details, current weather, forecast information, and prepares the data for display.

HTTP Client: Angular's HttpClient module is used to make HTTP requests to the weather API endpoints.

Material Design: The application utilizes Angular Material components for building a responsive and visually appealing user interface.

Charts: The ECharts library is used for visualizing the hourly temperature changes in the form of a line chart.

**Functionality:**

Search Functionality: Users can search for weather information by entering the name of a city in the search bar.

Real-time Updates: The application provides real-time updates of weather conditions, including temperature, humidity, wind speed, visibility, etc.

Graphical Representation: Hourly temperature changes are displayed graphically using ECharts, allowing users to visualize temperature trends throughout the day.

Error Handling: The application handles errors gracefully, such as when a location is not found.

Responsive Design: The application is designed to be responsive, ensuring a seamless user experience across different devices and screen sizes.

**API Integration:**

The application integrates with a weather API to fetch weather data, including current conditions, forecasts, and other weather-related information. It handles API requests and responses efficiently using Angular's HttpClient module.


**Overall:** 

The Weather Dashboard project demonstrates the use of Angular framework to build a modern web application that provides users with valuable weather information in an intuitive and visually appealing manner.

**Key Angular features and concepts:**

Modules (NgModule): Defined an AppModule using @NgModule decorator in app.module.ts to organize the application into cohesive blocks of functionality.

Data Binding: Used data binding to dynamically display data, such as {{}} interpolation and property binding [property]="value".

Directives: Used structural directives like *ngIf, *ngFor, and event binding like (keyup.Enter)="onSearch(location.value)" to manipulate the DOM based on conditions and user interactions.

HTTP Client: Imported and used HttpClient in WeatherService to fetch data from external APIs.

Observables and RxJS: Used observables to handle HTTP requests and data streams.

Angular Material: Imported and used Angular Material components and modules (MatToolbar, MatButtonModule, etc.) for styling UI components in the application.