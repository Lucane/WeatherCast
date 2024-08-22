import { useState, useRef } from 'react';
import './App.scss';
import { OpenWeatherProps } from './interfaces/OpenWeather';
import WindIcon from "./assets/windy.svg"
import HumidityIcon from "./assets/rain-drop.svg"
import SearchIcon from './assets/search-icon.svg?react';
import LocationIcon from './assets/location.svg?react';
import LocationSearchingIcon from './assets/location-searching.svg?react';
import LocationDisabledIcon from './assets/location-disabled.svg?react';
import { getWeatherIconName } from './interfaces/WeatherIconMap';
import { useLocationState, useLocationPermissionStatus, LocationPermissionStatus } from './hooks/Geolocation';

function WeatherCast() {
  const [input, setInput] = useState('');
  const [weatherData, setWeatherData] = useState<OpenWeatherProps>()
  const [isLoading, setIsLoading] = useState(false)
  const locationData = useLocationState()
  const locationPermissionStatus = useLocationPermissionStatus()

  const errorTimeoutRef = useRef<number | null>(null)
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
    clearError();

    setError({
      active: true,
      message: errorMessage.toUpperCase()
    })

    errorTimeoutRef.current = window.setTimeout(
      () => {
        clearError()
      }, 3000
    );
  }

  const clearError = async () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      setError({ message: '', active: false })
    }
  }

  const citySearch = async (event: any) => {
    if (event.key !== 'Enter' && event.type !== 'click') {
      return
    }

    event.preventDefault()
    event.target.blur()      // hide the mobile keyboard
    clearError()
    setIsLoading(true)
    setInput('')

    let query = ''

    if (['city-search', 'search-button'].includes(event.currentTarget.className)) {
      if (input.length === 0) {
        showError("input can't be blank")
        setIsLoading(false)
        return
      }
      query = `input=${input}`

    } else if (event.currentTarget.className === 'geo-button') {
      if (!locationData || !locationData.latitude || !locationData.longitude || locationData.error) {
        showError(locationData.error || "location unavailable")
        setIsLoading(false)
        return
      }
      query = `latitude=${locationData.latitude}&longitude=${locationData.longitude}`
    }

    await fetch(`/api/fetch-weather?${query}`)
      .then((res) => res.json())
      .then((res) => {
        setIsLoading(false)
        if (res.cod === 200) {
          setWeatherData(res)
        } else {
          showError(res.message)
        }
      })
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

        {isLoading ? (
          <div className="spinner" />
        ) : (
          <button className='search-button' onClick={citySearch} >
            <SearchIcon />
          </button>
        )}

        <button className='geo-button' disabled={isLoading} onClick={citySearch}>
          {!isLoading && locationPermissionStatus === LocationPermissionStatus.GRANTED && (
            <LocationIcon className='location-icon' />
          )}

          {isLoading && locationPermissionStatus === LocationPermissionStatus.GRANTED && (
            <LocationSearchingIcon className='location-icon' />
          )}

          {locationPermissionStatus !== LocationPermissionStatus.GRANTED && (
            <LocationDisabledIcon className='location-disabled-icon' />
          )}
        </button>

        {error.active && (
          <div className="error-message" onClick={clearError}>
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
              src={`/weather-icons/${getWeatherIconName(weatherData.weather[0])}.svg`}
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