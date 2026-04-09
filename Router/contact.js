const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')

//  add contact
//  Router.post('/add-contact',(req,res)=>{
//      console.log(req.body)
//      const newContact = new Contact({
//         fullName : req.body.name,
//         email : req.body.person_email,
//         phone : req.body.person_phone,
//         address : req.body.add
//      })

//      newContact.save()
//      .then(()=>{
//         console.log('data saved')
//         res.status(200).json({
//          msg: 'data saved'
//         })
//      })
//       .catch((err)=>{
//          console.log(err)
//          res.status(500).json({
//             error : 'something is wrong'
//          })
//       })
      
//  })


Router.post('/add-contact', async(req,res)=>{
   try
   {
   //   const newContact = new Contact({
   //      fullName : req.body.name,
   //      email : req.body.person_email,
  //       phone : req.body.person_phone,
  //       address : req.body.add
  //      })
    const newContact = new Contact (req.body)
    await newContact.save()
    res.status(200).json({
      msg : 'contact saved'
    })
    console.log(newData)

   }
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         msg : 'something is wrong'
      })
   }
})


// get all contact
Router.get('/all-contact',async(req,res)=>{
   try{
       const allContact = await Contact.find()
       res.status(200).json({
         contacts : allContact
       })
   }
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         error : err
      })
   }
})


// get contact by id 
Router.get('/Contact/:id',async(req,res)=>{
   try{
      const id = req.params.id
      const data = await Contact.findById(id).select("fullName address")
      res.status(200).json({
         contact : data 
      })

   }
   catch(err){
      console.log(err)
      res.status(500).json({
         error : err 
      })
   }
})


// get contact by gender
Router.get('/gender/:g',async(req,res)=>{
   try{
      const data = await Contact.find({gender:req.params.g})
      res.status(200).json({
         contact : data
      })

   }
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         error : err
      })
   }
})


// delete contact by id 
Router.delete('/:id',async(req,res)=>{
   try{
      await Contact.deleteOne({_id:req.params.id})
      res.status(200).json([
         msg = "data delete"
      ])

   }
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         error : err
      })
   }
})


// delete many by particular category/ies
Router.delete('/byGender/:g',async(req,res)=>{
   try
   {
      await Contact.deleteMany({gender:req.params.g})
      res.status(200).json({
         msg : `All data from ${req.params.g} gender is deleted .....`
      })

   }
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         error : err
      })
   }
})

 
     
   module.exports = Router
