import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'


const Notification = ({ message, messageType }) => {

  const color = messageType === 'error' ? 'red' : 'green';

  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === '') {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [messageTypeState, setMessageType] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault();
    if (newName === '' || newNumber === '') {
      setMessageType('error')
      setMessage(
        'Please fill in both name and number fields.'
      )
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 5000)
      return;
    }
  
    const existingPerson = persons.find(person => person.name === newName);
  
    if (existingPerson) {
      handleUpdatePerson(existingPerson);
    } else {
      handleCreatePerson();
    }
  };
  
  const handleUpdatePerson = (personToUpdate) => {
    const confirmUpdate = window.confirm(
      `${newName} is already added to the phonebook, replace the old number with a new one?`
    );
  
    if (!confirmUpdate) {
      console.log('User chose not to replace the number');
      return;
    }
  
    const updatedPerson = { ...personToUpdate, number: newNumber };
  
    personService
      .update(personToUpdate.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person =>
          person.id !== personToUpdate.id ? person : returnedPerson
        ));
        resetForm();
        setMessage(
          `Person '${returnedPerson.name}' updated successfully!`
        )
        setTimeout(() => {
          setMessage('')
        }, 5000)
      })
      .catch(error => {
        setMessageType('error')
        setMessage(
          `Information of '${newName}' has already been removed from server.`
        )
        setTimeout(() => {
          setMessage('')
          setMessageType('')
        }, 5000)
        setPersons(persons.filter(person => person.id !== personToUpdate.id));
      });
    
      
  };
  
  const handleCreatePerson = () => {
    const newPerson = { name: newName, number: newNumber };
  
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        resetForm();
        setMessage(
          `Person '${returnedPerson.name}' added successfully!`
        );
        setTimeout(() => {
          setMessage('')
        }, 5000);
      })
      .catch(error => {
        setMessageType('error')
        setMessage(
          `Information of '${newName}' has already been removed from server.`
        )
        setTimeout(() => {
          setMessage('')
          setMessageType('')
        }, 5000)
      });
  };
  
  const resetForm = () => {
    setNewName('');
    setNewNumber('');
  };

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons
  
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        }
        )
        .catch(error => {
          setMessageType('error')
          setMessage(
            `Information of '${name}' has already been removed from server.`
          )
          setTimeout(() => {
            setMessage('')
            setMessageType('')
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageTypeState}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={handleDelete} />
    </div>
  )
}

export default App
