import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const StatisticLine = (props) => {
  return (
    <div>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </div>
  )
}

const Statistics = (props) => {

  if (props.counterAll === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <table>
          <tbody>
            <tr>
              <td>No feedback given</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <tr>
            <StatisticLine text='good' value={props.counterGood} />
          </tr>
          <tr>
            <StatisticLine text='neutral' value={props.counterNeutral} />
          </tr>
          <tr>
            <StatisticLine text='bad' value={props.counterBad} />
          </tr>
          <tr>
            <StatisticLine text='all' value={props.counterAll} />
          </tr>
          <tr>
            <StatisticLine text='average' value={(props.counterGood * 1 + props.counterBad * -1) / props.counterAll} />
          </tr>
          <tr>
            <StatisticLine text='positive' value={((props.counterGood / props.counterAll) * 100) + '%'} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
    setAll(all + 1)
  }
  const increaseNeutral = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }
  const increaseBad = () => {
    setBad(bad + 1)
    setAll(all + 1)
  }

  return (
    <div>
      <Header text= 'give feeedback'/>
      <Button onClick= {increaseGood} text='good'/>
      <Button onClick= {increaseNeutral} text='neutral'/>
      <Button onClick= {increaseBad} text='bad'/>
      <Statistics counterGood={good} counterNeutral={neutral} counterBad={bad} counterAll={all}/>
    </div>
  )
}

export default App
