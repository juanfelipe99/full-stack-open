import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
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
