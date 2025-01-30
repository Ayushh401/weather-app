import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  data: WeatherData;
  isMain?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, isMain = false }) => {
  const date = new Date(data.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className={`${isMain ? 'col-span-full' : ''} bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow`}>
      <div className="flex flex-col items-center">
        <span className="text-gray-500 font-medium">{dayName}</span>
        <img 
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-16 h-16"
        />
        <div className="text-2xl font-bold">{Math.round(data.temp)}°C</div>
        <div className="text-gray-500 capitalize">{data.description}</div>
        
        <div className="flex gap-4 mt-2 text-gray-600">
          <div className="flex items-center gap-1">
            <Droplets size={18} />
            <span>{data.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind size={18} />
            <span>{Math.round(data.windSpeed)} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}