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
  const [cityName, setCityName] = useState('Prosser, WA, USA');
  const [isLoading, setIsLoading] = useState(true);

  const search = (lat, long) => {
    if (lat && long) {
      fetch(`${api.base}weather?lat=${lat}&lon=${long}&units=imperial&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setBackground(result);
          setIsLoading(false);
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
    } else if (weather.dt > weather.sys.sunset || weather.dt < weather.sys.sunrise) {
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
                      let city = '';
                      let state = '';
                      try {
                      city = suggestion.value.terms[suggestion.value.terms.length-3].value + ", ";
                      } catch {}
                      try {
                      state = suggestion.value.terms[suggestion.value.terms.length-2].value + ", ";
                      } catch {}
                      const country = suggestion.value.terms[suggestion.value.terms.length-1].value;
                      const cityName = `${city}${state}${country}`;
                      setCityName(cityName);
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
                <div className="bg-[rgba(0,0,0,0.4)] p-3 rounded-xl">
                  <div className="text-3xl text-white font-semibold">{cityName}</div>
                  <div className="text-xl text-white">{dateBuilder(new Date())}</div>
                </div>

                <div className="flex items-center justify-center bg-[rgba(0,0,0,0.4)] mt-10 h-80 p-2 rounded-xl ">
                  <div>
                    <div className="text-9xl text-white text-center">{Math.round(weather.main.temp)}<span className="text-5xl align-top">°F</span></div>
                    <div className="text-4xl text-white text-center">{weather.weather[0].main}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

      </div>

    </>
  )
}

export default App
