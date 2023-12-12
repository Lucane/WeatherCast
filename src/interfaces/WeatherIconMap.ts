import { Weather } from './OpenWeather'

// Full list of available weather conditions:
// https://openweathermap.org/weather-conditions

/**
 * Derives the weather status SVG icon filename from the OpenWeatherMap API response.
 *
 * @param {number} weather - `weather` object from the OpenWeatherMap API.
 * @returns {string} SVG icon filename for the weather status [ex. `'day-clear.svg'`].
 * @remarks
 * Defaults to daytime icon if the original icon name is invalid.  
 * Defaults to `Unknown` icon if the weather status ID is invalid.
 * @link https://openweathermap.org/weather-conditions
 * 
 */
export const getWeatherIconName = (weather: Weather) => {
    if (!weather.id || !idToSvgMap[weather.id]) {
        return Modifiers.Unknown
    }

    // OpenWeatherMap API icon names have a suffix 'd' for daytime and 'n' for night-time.
    // This sets the SVG filename prefix based on the filename of the original icon.
    // 'day-' for daytime, 'night-' for night-time. Defaults to daytime.
    var isDaytime = weather.icon ? weather.icon.slice(-1) === 'd' : true
    var prefix = isDaytime ? 'day-' : 'night-'

    return prefix + idToSvgMap[weather.id]
}

enum Modifiers {
    Day = 'day',
    Night = 'night',
    Clear = 'clear',
    Cloudy = 'cloudy',
    Overcast = 'overcast',
    Extreme = 'extreme',
    Hail = 'hail',
    Snow = 'snow',
    Sleet = 'sleet',
    Drizzle = 'drizzle',
    Rain = 'rain',
    Dust = 'dust',
    Fog = 'fog',
    Smoke = 'smoke',
    Haze = 'haze',
    Thunder = 'thunderstorms',
    Hurricane = 'hurricane',
    Unknown = 'unknown',
}

const idToSvgMap: Record<number, string> = {

    // Group 2xx > THUNDERSTORM
    200: Modifiers.Thunder + '-' + Modifiers.Rain,    // thunderstorm with light rain
    201: Modifiers.Thunder + '-' + Modifiers.Rain,    // thunderstorm with rain
    202: Modifiers.Thunder + '-' + Modifiers.Rain,    // thunderstorm with heavy rain
    210: Modifiers.Thunder,                           // light thunderstorm
    211: Modifiers.Thunder,                           // thunderstorm
    212: Modifiers.Thunder,                           // heavy thunderstorm
    221: Modifiers.Thunder,                           // ragged thunderstorm
    230: Modifiers.Thunder + '-' + Modifiers.Rain,    // thunderstorm with light drizzle
    231: Modifiers.Thunder + '-' + Modifiers.Rain,    // thunderstorm with drizzle
    232: Modifiers.Thunder + '-' + Modifiers.Rain,    // thunderstorm with heavy drizzle

    // Group 3xx > DRIZZLE
    300: Modifiers.Drizzle,    // light intensity drizzle
    301: Modifiers.Drizzle,    // drizzle
    302: Modifiers.Drizzle,    // heavy intensity drizzle
    310: Modifiers.Drizzle,    // light intensity drizzle rain
    311: Modifiers.Drizzle,    // drizzle rain
    312: Modifiers.Drizzle,    // heavy intensity drizzle rain
    313: Modifiers.Drizzle,    // shower rain and drizzle
    314: Modifiers.Drizzle,    // heavy shower rain and drizzle
    321: Modifiers.Drizzle,    // shower drizzle

    // Group 5xx > RAIN
    500: Modifiers.Rain,    // light rain
    501: Modifiers.Rain,    // moderate rain
    502: Modifiers.Rain,    // heavy intensity rain
    503: Modifiers.Rain,    // very heavy rain
    504: Modifiers.Rain,    // extreme rain
    511: Modifiers.Rain,    // freezing rain
    520: Modifiers.Rain,    // light intensity shower rain
    521: Modifiers.Rain,    // shower rain
    522: Modifiers.Rain,    // heavy intensity shower rain
    531: Modifiers.Rain,    // ragged shower rain

    // Group 6xx > SNOW
    600: Modifiers.Snow,    // light snow
    601: Modifiers.Snow,    // snow
    602: Modifiers.Snow,    // heavy snow
    611: Modifiers.Sleet,    // sleet
    612: Modifiers.Sleet,    // light shower sleet
    613: Modifiers.Sleet,    // shower sleet
    615: Modifiers.Sleet,    // light rain and snow
    616: Modifiers.Sleet,    // rain and snow
    620: Modifiers.Snow,    // light shower snow
    621: Modifiers.Snow,    // shower snow
    622: Modifiers.Snow,    // heavy shower snow

    // Group 7xx > ATMOSPHERE
    701: Modifiers.Haze,    // mist
    711: Modifiers.Smoke,    // smoke
    721: Modifiers.Haze,    // haze
    731: Modifiers.Dust,    // sand/dust whirls
    741: Modifiers.Fog,    // fog
    751: Modifiers.Dust,    // sand
    761: Modifiers.Dust,    // dust
    762: Modifiers.Dust,    // volcanic ash
    771: Modifiers.Clear,    // squalls
    781: Modifiers.Hurricane,    // tornado

    // Group 800 > CLEAR
    800: Modifiers.Clear,    // clear sky

    // Group 80x > CLOUDS
    801: Modifiers.Cloudy,    // few clouds: 11-25%
    802: Modifiers.Cloudy,    // scattered clouds: 25-50%
    803: Modifiers.Overcast,    // broken clouds: 51-84%
    804: Modifiers.Extreme,    // overcast clouds: 85-100%

}