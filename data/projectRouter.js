const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');

const Helper = require('./projectModel')

router.post('/register', async (req, res)=>{
    try{
        const {username, password} = req.body //used to get data from the post request
        const hash = bcrypt.hashSync(password, 10) // sets how many times the pass is hashed
        const user = {username, password:hash}// using the has instead of the unencrypted password
        const addUser = await Helper.add(user)
        // this is now getting whatever our add function sends back and setting it to addUser
        res.json(addUser)
    }
    catch{
        res.status(500).json({message:"you hit the sad path"})
    }
})

router.post('/login', async (req, res)=>{
    // First we must check to see if the logininfo is there and relavent. should have middleware here
    try{  
        const [user]= await Helper.findBy({username:req.body.username})
        if(user && bcrypt.compareSync(req.body.password, user.password)){
            console.log(user)
            req.session.user= user
            console.log("not here", req.session.user)
            res.status(200).json({message:`Welcome ${req.body.username}`})
        }
        else{
            res.status(401).json({message:"The sad path is real"})
        }
       }
       catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

router.get('/', secure, (req, res)=>{
    Helper.find()
    .then(users =>{
        res.status(200).json(users)
    })
    .catch(err => res.status(404).json({message:"sad path again", err}))
})
//MiddleWare

function secure(req, res, next) {
    // check if there is a user in the session
    if (req.session && req.session.user) {
      next()
    } else {
      res.status(401).json({ message: 'Unauthorized!' })
    }
  }

module.exports =router