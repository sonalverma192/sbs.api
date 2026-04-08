const express = require('express')
const Router = express.Router()

//signup api
Router.post('/signup',(req,res)=>{
    res.status(200).json({
        message:'signup response'
    })
})

//login api
Router.post('/login',(req,res)=>{
    res.status(200).json({
        data:'login response'
    })
})


module.exports = Router