require('dotenv').config()
const express = require('express');
const Person = require('./models/person')
const morgan = require('morgan');

const app = express();

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json());

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

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
    .then(person => {
        if (person){
            console.log(`found person ${person.name} with id ${id}`)
            response.json(person)
        } else {
            console.log(`person with id ${id} not found`)
            response.status(404).send('<h1>Person Not Found</h1>')
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    console.log(`deleting id ${id} in backend`)
    Person.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateId = () => {
    const id = Math.floor(Math.random() * 1000000).toString();
    return id
}

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).send({ error: 'Person not found' })
            }

            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
