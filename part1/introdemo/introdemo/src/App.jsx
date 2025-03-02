const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10
  return (
    <>
      <h1>Greetings</h1>

      <Hello name='Juan' age={10 + 16}/>
      <Hello name='Aura' age={age}/>
      <Hello name={name}/>
    </>
  )
}

export default App
