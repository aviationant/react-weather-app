import { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import './styles/GoogleAPI.css';

const api = {
  key: "dbc49d992752d870b8a48bc1ea5a8147",
  base: "https://api.openweathermap.org/data/2.5/"
}

const GOOGLE_API = import.meta.env.VITE_GOOGLE_API;

function App() {
  const [location, setLocation] = useState('Prosser, WA, USA');
  const [weather, setWeather] = useState({});
  const [choice, setChoice] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const search = (lat, long) => {
    if (lat && long) {
      fetch(`${api.base}weather?lat=${lat}&lon=${long}&units=imperial&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setBackground(result);
          setIsLoading(false);
          console.log(weather);
        }).catch(error => {
          console.log('Fetch error:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }

  function setBackground(weather) {
    let style = '';
    if (weather.weather[0].main === 'Clear' &&
      weather.dt > weather.sys.sunrise &&
      weather.dt < weather.sys.sunset) {
      style = 'sunny';
    } else if (weather.dt > weather.sys.sunset) {
      style = 'night';
    } else if (weather.weather[0].main === 'Clouds' ||
      weather.weather[0].main === 'Rain' ||
      weather.weather[0].main === 'Haze'
    ) {
      style = 'stormy';
    } else if (weather.weather[0].main === 'Snow') {
      style = 'snowy';
    }

    const container = document.querySelector('.container');
    container.classList.remove('show-sunny', 'show-night', 'show-stormy', 'show-snowy');
    container.classList.add(`show-${style}`)
  }

  function getLatlong(address) {
    setIsLoading(true);
    if (!window.google) {
      console.error('Google Maps API not loaded');
      setIsLoading(false);
      return;
    }
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      'address': address
    }, function (results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        search(latitude, longitude);
      } else {
        console.error('Geocode failed:', status);
        setIsLoading(false);
      }
    });
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${month} ${date}, ${year}`
  }


  useEffect(() => {
    getLatlong(location);
  }, []);


  return (


    <>
      <div className='container show-snowy'>
        <div className='bgImg sunny'></div>
        <div className='bgImg night'></div>
        <div className='bgImg stormy'></div>
        <div className='bgImg snowy'></div>

        <main>
          <div className='content'>
            <div className="search-box">
              <div className="google-places-autocomplete-wrapper">
                <GooglePlacesAutocomplete apiKey={GOOGLE_API}
                  selectProps={{
                    onChange: (suggestion) => {
                      const newLocation = suggestion.label;
                      setLocation(newLocation);
                      getLatlong(newLocation);
                    },
                  }} />
              </div>
            </div>

            {isLoading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <div className="location-box">
                  <div className="text-5xl ">{location}</div>
                  <div className="date">{dateBuilder(new Date())}</div>
                </div>
                <div className="weather-box"></div>
                <div className="text-2xl">{Math.round(weather.main.temp)}°F</div>
                <div className="weather">{weather.weather[0].main}</div>
              </>
            )}
          </div>
        </main>

      </div>

    </>
  )
}

export default App
