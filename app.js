const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json());

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'))

    var students = [
    {id: 1, name: 'ipek'},
    {id: 2, name: 'kutluhan'}
]

app.get('/', (req, res) => {
    console.log('Welcome to Students App')
    res.send('Welcome to Students App')
})

// list all students
app.get('/api/students', (req, res) => {
    res.send(students)
})

// list single student
app.get('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(404).send('The student does not exist')
    res.send(student)
})

// save student
app.post('/api/students', (req, res) => {
    const validationResult = validateStudent(req.body)
    if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message)

    const newStudent = {
        id: students.length + 1,
        name: req.body.name
    }

    students.push(newStudent)
    res.send(newStudent)
})

// update student
app.put('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(404).send('The student does not exist')

    const validationResult = validateStudent(req.body)    
    if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message)

    student.name = req.body.name
    res.send(student)
})

// delete student
app.delete('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id))
    if(!student) return res.status(404).send('The student does not exist')

    const index = students.indexOf(student)
    students.splice(index, 1)

    res.send(student)
})

// common validation method
function validateStudent(student){
    const schema = {
        name: Joi.string().required()
    }

    return Joi.validate(student, schema)
}

// Start application
app.listen(3000, () => console.log('Listening port 3000...'))