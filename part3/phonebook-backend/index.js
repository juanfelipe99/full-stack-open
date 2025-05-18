require('dotenv').config()
const express = require('express');
const Person = require('./models/person')
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  }
  return '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
    })
});

app.get('/info', (request, response) => {
    Person.find({}).countDocuments().then(count => {
        const date = new Date()
        const info = `<p>Phonebook has info for ${count} people</p>`
        const dateInfo = `<p>${date}</p>`
        console.log(info + dateInfo)
        response.send(info + dateInfo)
    })
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id)
    .then(person => {
        if (person === null) {
            return response.status(404).send('<h1>Person Not Found</h1>')
        } else {
            console.log(`found person ${person.name} with id ${id}`)
        }
        response.json(person)
    })
    .catch(error => {
        console.log(error)
        response.status(404).send('<h1>Person Not Found</h1>')
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(`deleting id ${id} in backend`)
    Person.findByIdAndRemove(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(404).send({ error: 'Person not found' })
        })
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

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
