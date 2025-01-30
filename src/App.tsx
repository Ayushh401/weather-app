import React, { useState } from 'react';
import axios from 'axios';
import { Cloud, Loader2 } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { Map } from './components/Map';
import { WeatherData, Location } from './types/weather';

// Note: You'll need to replace this with your actual API key
const API_KEY = '1c32edcdfbce60e9d38d71f736e54f3a';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (query: string) => {
    setLoading(true);
    setError('');
    try {
      // Get coordinates
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`
      );

      if (geoRes.data.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon, name } = geoRes.data[0];
      setLocation({ lat, lon, name });

      // Get weather data
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      // Process and filter data for 7 days
      const processedData = weatherRes.data.list
        .filter((_: any, index: number) => index % 8 === 0)
        .slice(0, 7)
        .map((item: any) => ({
          date: item.dt_txt,
          temp: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        }));

      setWeatherData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
          </div>
          <SearchBar onSearch={fetchWeather} />
        </div>

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}

        {location && weatherData.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <WeatherCard data={weatherData[0]} isMain />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {weatherData.slice(1).map((data, index) => (
                    <WeatherCard key={index} data={data} />
                  ))}
                </div>
              </div>
              <Map location={location} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;