require('dotenv').config();
const express = require('express')
const app = express()
const userRoute = require('./Router/user')
const contactRoute = require('./Router/contact')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

// mongoose.connect('')
// .then(()=>{
//     console.log('connect with database')
// })
// .catch(err=>{
//     console.log('something is wrong')
//     console.log(err)
// })

const connectWithDatabase = async()=>{
    try
    {
       await mongoose.connect(process.env.MONGODATABASE_URL)
       console.log('connected with database')
    }
    catch(err)
    {
        console.log(err)
        console.log('something is wrong')
    }
}

connectWithDatabase()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(fileUpload({
useTempFiles : true,
tempFileDir : '/temp/'
}
))

app.use('/user',userRoute)
app.use('/contact',contactRoute)


module.exports = app  