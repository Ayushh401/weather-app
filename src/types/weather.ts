export interface WeatherData {
  date: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface Location {
  lat: number;
  lon: number;
  name: string;
}