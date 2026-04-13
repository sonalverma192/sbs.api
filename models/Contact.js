const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    fullName :{String,require:true},
    phone :{String,require:true},
    email : {String,require:true},
    address : {String,require:true}
})

module.exports = mongoose.model('contact',contactSchema)