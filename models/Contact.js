const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    fullName :String,
    phone :String,
    email : String,
    address : String,
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    imageId : String,
    gender : String,
    imageUrl : String
})

module.exports = mongoose.model('contact',contactSchema)