Simple weather app build with React + Vite that allows user to search by location and get current temperature and weather conditions.
Background auto changes between Sunny, Night, Stormy, and Snowy depending on conditions.
Deployed on AWS Amplify at https://weather.dontlook.cc

# React Weather App

A sleek weather app built with **React** and **Vite**, deployed on **AWS Amplify** using the **OpenWeatherMap API** for real-time weather data.

## Architecture

### Frontend
- **Framework**: React + Vite.
- **Deployment**: AWS Amplify.

### Backend
- **API**: Google Places Autocomplete for autocomplete, Google Places Geocoding for lat/lon, and OpenWeatherMap for weather data.
- **Configuration**: API key stored in `.env` for secure access.

## Setup

### Frontend
1. Clone: `git clone https://github.com/aviationant/react-weather-app.git`.
2. Install: `npm install`.
3. Configure: Add OpenWeatherMap API key to `.env` (`VITE_API_KEY`).

## Local Development
- Run: `npm run dev` (`localhost:5173`).
- Ensure `.env` has `VITE_API_KEY` for API access.
