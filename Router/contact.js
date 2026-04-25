require('dotenv').config();
const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2

cloudinary.config({
   cloud_name : process.env.CLOUD_NAME,
   api_key : process.env.API_KEY,
   api_secret : process.env.API_SECRET
})

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

//  add-contact 

Router.post('/add-contact', async(req,res)=>{
   try
   {
      // console.log(req.headers.authorization.split(" ")[1])
      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      console.log(tokenData)
      const uploadResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
      console.log(uploadResult)
     const newContact = new Contact({
        fullName : req.body.fullName,
        email : req.body.email,
        phone : req.body.phone,
        address : req.body.address,
        gender: req.body.gender,
        userId: tokenData.userId,
        imageId : uploadResult.public_id,
        imageUrl : uploadResult.secure_url
       })
    
    const newData = await newContact.save()
    res.status(200).json({
      result : newData
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


// get all contact
Router.get('/all-contact',async(req,res)=>{
   try{
      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      const allContact = await Contact.find({userId:tokenData.userId}).select("_id fullName email phone address gender userId").populate('userId','fullName email')
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
      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      const id = req.params.id
      // const data = await Contact.findById(id).select("fullName address")
      const data = await Contact.find({_id:req.params.id,userId:tokenData.userId})
          return res.status(200).json({
         contact : data.length>0 ? data[0] : {} 
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
      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      const contact = await Contact.find({gender:req.params.g,userId:tokenData.userId})
      res.status(200).json({
         contact : contact
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
      // const token = req.headers.authorization.split(" ")[1]
      // const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      // await Contact.deleteOne({_id:req.params.id,userId:tokenData.userId})
      // res.status(200).json([
      //    msg = "data delete"
      // ])

      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      const contact = await Contact.findById(req.params.id)
      if(contact.userId != tokenData.userId)
      {
         return res.status(500).json({
            msg:"invalid user"
         })
      }

      await cloudinary.uploader.destroy(contact.imageId)
      await Contact.deleteOne({_id:req.params.id,userId:tokenData.userId})
       res.status(200).json({
         msg:"data delete"
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


// delete many by particular category/ies
Router.delete('/byGender/:g',async(req,res)=>{
   try
   {
      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      await Contact.deleteMany({gender:req.params.g,userId:tokenData.userId})
      res.status(200).json({
         msg : `All contactof this gender is deleted .....`
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

// update contact
Router.put('/update/:id',async(req,res)=>{
   try
   {
      console.log(req.body)
      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      const contactData = await Contact.findById(req.params.id)
      if(contactData.userId != tokenData.userId)
      {
         return res.status(500).json({
            msg:'you dont have permission to update this data'
         })
      }
      // console.log(contactData)
      const newData = ({
         fullName:req.body.fullName,
         email:req.body.email,
         gender:req.body.gender,
         address:req.body.address,
         userId:req.body.userId,
         phone:req.body.phone
      })

      if(req.files)
      {
         cloudinary.uploader.destroy(contactData.imageId)
         const uploadResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
         newData["imageId"]= uploadResult.public_id,
         newData["imageUrl"] = uploadResult.secure_url
      }
      else
      {
         newData["imageId"] = contactData.imageId,
         newData["imageUrl"] = contactData.imageUrl
      }

      const updateContact = await Contact.findByIdAndUpdate(req.params.id,newData,{new:true})
      res.status(200).json({
         msg:'contact updated',
         result:updateContact
      })

   }
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         error:err
      })
   }
})

// count contact
Router.get('/count',async(req,res)=>{
   try
   {
      const token = req.headers.authorization.split(" ")[1]
      const tokenData = await jwt.verify(token,process.env.SEC_KEY)
      const data = await Contact.countDocuments({userId:tokenData.userId})
      res.status(200).json({
         count : data
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
