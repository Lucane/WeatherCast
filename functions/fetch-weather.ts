import axios from 'axios';
import { Handler } from '@netlify/functions';
import { OpenWeatherProps } from '../src/interfaces/OpenWeather';

interface QueryStringParams {
  input?: string;
  latitude?: string;
  longitude?: string;
}

export const handler: Handler = async function (event) {
  const { input, latitude, longitude } = event.queryStringParameters as QueryStringParams;
  const API_SECRET = process.env.OPENWEATHER_SECRET;
  const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';

  try {
    const { data } = await axios.get<OpenWeatherProps>(API_ENDPOINT, {
      params: {
        q: input,
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: API_SECRET,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    const { status, data } = error.response;

    return {
      statusCode: status,
      body: JSON.stringify(data),
    };
  }
};
