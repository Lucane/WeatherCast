# WeatherCast <img src="/src/assets/logo.svg" width="30" />
[![Netlify Status](https://api.netlify.com/api/v1/badges/4e566b62-a67b-4b82-aa7e-ab2a412e713f/deploy-status)](https://app.netlify.com/sites/weathercast-demo/deploys) &emsp; [![Live demo](https://img.shields.io/badge/Live_demo-WeatherCast-c36e9f)](https://weathercast-demo.netlify.app/)

A simple weather application for retrieving the weather conditions of any city in the world.

![weathercast](https://github.com/Lucane/WeatherCast/assets/7999446/65231e8d-dfdf-48ea-b821-8adebf628da3)

## Getting Started

These instructions outline the steps on how to setup a local development environment.

### Prerequisites

In order to gain access to the weather data provided by the OpenWeather API, you have to first [create an account](https://home.openweathermap.org/users/sign_up).

After that, you can [access the API keys through your account](https://home.openweathermap.org/api_keys).

The free plan provides up to 60 calls/minute. [See the pricing plan for more details.](https://openweathermap.org/full-price#current)

### Installation

1. Open a terminal and navigate to the folder where you [cloned the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
2. Run `npm install` to install the required dependencies
3. In the project root, create a copy of the file `.env_example` and rename it to `.env`
4. Input the OpenWeather API secret to the variable contained within the `.env` file
5. In a terminal run `netlify dev` to start the local development server

## Deployment on Netlify

In order to deploy the project on Netlify, [follow this guide](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/).

After the site has been created on Netlify, you need to add the OpenWeather API secret:
1. Navigate to `Site configuration` › `Environment variables`
2. Select the option `Add a single variable`
3. For the `Key` field, input "OPENWEATHER_SECRET"
4. For the `Values` field, input the API secret you retrieved from your OpenWeather account
5. Finally, click on `Create variable`

You should now have a fully functional Netlify deployment.

This project has been designed for deployment on Netlify, but with minor changes it can also be migrated to other services.

## Acknowledgments

* [Meteocons](https://github.com/basmilius/weather-icons) - for providing the wonderfully animated weather icons ✨
