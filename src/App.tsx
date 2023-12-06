import { useState } from 'react';
import './App.scss';
import { OpenWeatherProps } from './interfaces/OpenWeather';
import WindIcon from "./assets/windy.svg"
import HumidityIcon from "./assets/rain-drop.svg"
import SearchIcon from './assets/search-icon.svg?react';

function WeatherCast() {
  const [input, setInput] = useState('');
  const [weatherData, setWeatherData] = useState<OpenWeatherProps>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({
    active: false,
    message: ''
  })

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

  const showError = async (errorMessage: string) => {
    setError({
      active: true,
      message: errorMessage.toLowerCase()
    })

    setTimeout(
      () => setError({ message: '', active: false }), 3000
    );
  }

  const clearError = async () => {
    setError({ message: '', active: false })
  }

  const citySearch = async (event: any) => {
    if (event.key === 'Enter' || event.type === 'click') {
      event.preventDefault();
      clearError()
      setIsLoading(true)
      setInput('');

      await fetch(`/api/fetch-weather?input=${input}`)
        .then((res) => res.json())
        .then((res) => {
          setIsLoading(false)
          console.log(res)
          if (res.cod === 200) {
            setWeatherData(res)
          } else {
            showError(res.message);
          }
        })
    }
  };

  return (
    <div className="container">
      <div className="heading">WeatherCast</div>
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

        {(isLoading && !error.active) ? (
          <div className="spinner" />
        ) : (
          <button className='search-button' onClick={citySearch} >
            <SearchIcon />
          </button>
        )
        }

        {error.active && (
          <div className="error-message">
            {error.message}
          </div>
        )}
      </div>

      {weatherData && weatherData.main && (
        <div className='expander'>
          <div className="city-name">
            {weatherData.name}, {weatherData.sys.country}
          </div>
          <div className="date">
            {toReadableDate()}
          </div>
          <div className="icon-temp">
            <img
              draggable="false"
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            {Math.round(weatherData.main.temp)}
            <sup className="deg">&nbsp;°C</sup>
          </div>

          <div className='weather-description'>
            {weatherData.weather[0].description.toUpperCase()}
          </div>

          <div className='weather-conditions'>
            <div className='feels-like'>
              feels like {Math.round(weatherData.main.feels_like)} °C
            </div>

            <div className='wind-speed'>
              <img src={WindIcon} draggable="false" alt='Wind speed' className='wind-speed-icon' />
              {Math.round(weatherData.wind.speed)} m/s
            </div>

            <div className='humidity'>
              <img src={HumidityIcon} draggable="false" alt='Humidity' className='humidity-icon' />
              {weatherData.main.humidity} %
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherCast;