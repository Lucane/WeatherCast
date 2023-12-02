import { useState } from 'react';
import axios from 'axios';
import './App.scss';
import { OpenWeatherProps } from './interfaces/OpenWeather';

function WeatherCast() {
  const [input, setInput] = useState('');
  const [weatherData, setWeatherData] = useState<OpenWeatherProps>()
  const [isLoading, setIsLoading] = useState(false)

  const toReadableDate = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const WeekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]
      }`;

    return date;
  };

  const citySearch = async (event: any) => {
    if (event.key === 'Enter') {
      setIsLoading(true)
      event.preventDefault();
      setInput('');
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = '***REMOVED***';
      await axios
        .get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        })
        .then((res) => {
          setWeatherData(res.data)
          setIsLoading(false)
        });
    }
  };

  return (
    <div className="container">
      <h1 className="heading">WeatherCast</h1>
      <div className="search-bar">
        <input
          autoFocus
          spellCheck="false"
          type="text"
          className="city-search"
          placeholder="Enter your city . . ."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={citySearch}
        />
        
        {isLoading && (
            <div className="spinner" />
        )}
      </div>

      {weatherData && weatherData.main && (
        <div className='expander'>
          <div className="city-name">
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
          </div>
          <div className="date">
            {toReadableDate()}
          </div>
          <div className="icon-temp">
            <img
              className=""
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            {Math.round(weatherData.main.temp)}
            <sup className="deg">&nbsp;°C</sup>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherCast;