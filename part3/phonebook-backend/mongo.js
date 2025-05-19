const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://feliperivero:${password}@clusterfullstackopen.5ki2pke.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterFullStackOpen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
    return;
}

const personName = process.argv[3]
const personNumber = process.argv[4]

const person = new Person({
  name: personName,
  number: personNumber
})

person.save().then(result => {
  console.log('person saved!')
  console.log(result)
  mongoose.connection.close()
})