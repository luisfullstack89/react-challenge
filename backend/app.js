const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const employeeController = require('./controller/employeeController')
const employeeRoutes = require('./routes/employeeRoutes')


const app = express()
const port = 8000



app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()

});

app.use('/employee',employeeRoutes )

app.use((error,req,res,next)=>{
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message 
    const messages = error.messages
    res.status(status).json({
        message : message,
        statusCode : status,
        messages : messages
    })
})

const connection = async () => {
    const con = await mongoose.connect('mongodb://localhost:27017/employee-data')
    console.log('connection created!')
    app.listen(port)
}

connection()

