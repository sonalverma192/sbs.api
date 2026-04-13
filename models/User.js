const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName :{String,require:true},
    phone :{String,require:true},
    email : {String,require:true},
    password : {String,require:true}
})

module.exports = mongoose.model('user',userSchema)