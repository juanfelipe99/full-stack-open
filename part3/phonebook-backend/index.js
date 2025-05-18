require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person')

const app = express();

app.use(express.json());
app.use(express.static('dist'))

morgan.token('body', (req) => req.body ? JSON.stringify(req.body) : '');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
    })
});

app.get('/info', (request, response) => {
    const date = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p>`
    const dateInfo = `<p>${date}</p>`
    console.log(info + dateInfo)
    response.send(info + dateInfo)
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send('<h1>Person not found</h1>')
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(`deleting id ${id} in backend`)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * 1000000).toString();
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    };

    const existingPerson = persons.find(person => person.name === body.name)
    if (existingPerson) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    };

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
