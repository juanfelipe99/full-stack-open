import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'


const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
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
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault();
    if (newName === '' || newNumber === '') {
      console.log('Name or number field is empty');
      alert('Please fill in both name and number fields.');
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
        setSuccessMessage(
          `Person '${returnedPerson.name}' updated successfully!`
        )
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      })
      .catch(error => {
        alert(`Failed to update ${newName}. It might have been removed from the server.`);
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
        setSuccessMessage(
          `Person '${returnedPerson.name}' added successfully!`
        );
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000);
      })
      .catch(error => {
        alert('Failed to add the person. Please try again.');
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
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== id))
        }
        )
        .catch(error => {
          alert(`Information of ${name} has already been removed from server`)
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
      <Notification message={successMessage}/>
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
