import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const weatherApi = (lat, lon) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
    .then(response => {
      console.log(response.data.weather[0].icon)
      return response.data
    }).catch(error => {
      console.error('Error fetching weather data:', error)
      return null
    }
  )
}

const WeatherIcon = ({ icon }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
  return <img src={iconUrl} alt="Weather icon" />
}

const Weather = ({ weather }) => {
  if (!weather) {
    return null
  }
  return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <p>Temperature: {weather.main.temp} °C</p>
      <WeatherIcon icon={weather.weather[0].icon} />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country.capitalInfo.latlng) {
      const [lat, lon] = country.capitalInfo.latlng
      weatherApi(lat, lon).then(data => setWeather(data))
    }
  }, [country])

  return (
    <div>
    <h1>{country.name.common}</h1>
    <p>Capital {country.capital}</p>
    <p>Area {country.area}</p>
    <h2>Languages</h2>
    <ul>
      {Object.values(country.languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt="flag" />
    <Weather weather={weather} />
    </div>
  )
}

const Countries = ({ countries, setFinder }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter.</p>
  } else if (countries.length < 10 && countries.length > 1) {
    return (
      <ul>
        {countries.map((country, index) => (
          <li key={index}>
            {country.name.common}
            <button onClick={() => setFinder(country.name.common)}>show</button>
          </li>
        ))}
      </ul>
  )} else if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  } 
}

function App() {

  const [countries, setCountries] = useState([])
  const [finder, setFinder] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      console.log('promise fulfilled')
      setCountries(response.data)
    })
  }, [])

  const countriesToShow = finder === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(finder.toLowerCase())
      )

  const handleFinderrChange = (event) => {
    setFinder(event.target.value)
  }

  return (
    <div>
      find countries <input value={finder} onChange={handleFinderrChange}/>
      <Countries countries={countriesToShow} setFinder={setFinder} />
    </div>

  )
}

export default App
