const express = require('express')
const User = require('../models/user')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
// const { sendWelcomeEmail } = require('../emails/account')
const sharp = require('sharp')

router.get('/',async(req,res)=>
{
  res.render('landingpage')
})
router.get('/signup',async(req,res)=>
{
     res.render('signuppage')
})

router.get('/login',async(req,res)=>
{
  res.render('loginpage')
})

router.get('/forpass',async(req,res)=>
{
  res.render('forpass')
})


router.get('/frontpage',auth,async(req,res)=>
{
  console.log(req.header('Authorization'))
  res.send({'message':'rendered'})
})
router.get('/settings',auth,async(req,res)=>
{
  const user=req.user
  res.render('settings',{user,message:req.flash('message')})
})

router.post('/users/signup/restrict', async (req, res) => {
  const user=new User({
    name:req.body.name,
    email:req.body.mailmail,
    password:req.body.passpass,
    age:req.body.age

})
console.log(req.body.mailmail)
  try{
    await user.save()
    // sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    console.log(user);
    res.redirect('/login')
  }catch(e){
    res.status(400).send()
  }
})
// router.get('/token',async(req,res)=>
// {
//   const user = this
//   const token = jwt.sign({_id : user._id.toString() }, 'thisismynewcourse')

//   user.tokens = user.tokens.concat({ token})
//   await user.save()
//   return token
// })

router.get('/users/loginagain',auth, async (req, res) => {
  try {
    // console.log('came here')
    // console.log(req.body.email)
    // const user = await User.findByCredentials(req.body.Email,req.body.password)
    // const token = await user.generateAuthToken()
    // res.cookie('id',token,{sameSite:true})
    // console.log('generated token')
    // console.log(token)
    user=req.user
    const tasks1=await Task.find({completed:0,owner:user._id})
    const tasks2=await Task.find({completed:1,owner:user._id})
    const person=await Task.find({completed:0,label:'Personal',owner:user._id})
    const work=await Task.find({completed:0,label:'Work',owner:user._id})
    const shop=await Task.find({completed:0,label:'Shopping',owner:user._id})
    const other=await Task.find({completed:0,label:'Others',owner:user._id})
    res.render('frontpage1',{user,tasks1,tasks2,person,work,shop,other})
    //res.render('frontpage',{user,tasks1,tasks2})
  }catch(e) {
    res.redirect('/login')
  }
})

router.post('/users/login', async (req, res) => {
  try {
    console.log('came here')
    console.log(req.body.email)
    const user = await User.findByCredentials(req.body.Email,req.body.password)
    const token = await user.generateAuthToken()
    res.cookie('id',token,{sameSite:true})
    console.log('generated token')
    console.log(token)
    const tasks1=await Task.find({completed:0,owner:user._id})
    const tasks2=await Task.find({completed:1,owner:user._id})
    const person=await Task.find({completed:0,label:'Personal',owner:user._id})
    const work=await Task.find({completed:0,label:'Work',owner:user._id})
    const shop=await Task.find({completed:0,label:'Shopping',owner:user._id})
    const other=await Task.find({completed:0,label:'Others',owner:user._id})
    res.render('frontpage1',{user,tasks1,tasks2,person,work,shop,other})
    //res.render('frontpage',{user,tasks1,tasks2})
  }catch(e) {
    res.status(400).send()
  }
})
router.get('/users/taskpage',auth,async (req, res) => {
  try {
    const user=req.user
    const tasks1=await Task.find({completed:0,owner:user._id})
    const tasks2=await Task.find({completed:1,owner:user._id})
    const person=await Task.find({completed:0,label:'Personal',owner:user._id})
    const work=await Task.find({completed:0,label:'Work',owner:user._id})
    const shop=await Task.find({completed:0,label:'Shopping',owner:user._id})
    const other=await Task.find({completed:0,label:'Others',owner:user._id})
    res.render('frontpage',{user,tasks1,tasks2,person,work,shop,other,message:req.flash('message')})
    //res.render('frontpage',{user,tasks1,tasks2,message:req.flash('message')})
    //res.render('frontpage',{user,tasks1,tasks2})
  }catch(e) {
    res.status(400).send()
  }
})

router.post('/users/loginpage', async (req, res) => {
  try {
    console.log('came here')
    console.log(req.body.email)
    console.log('this is here')
    console.log(req.header('Authorization'))
    const user = await User.findByCredentials(req.body.email,req.body.password)
    //const token = await user.generateAuthToken()
    //console.log(token)
    const tasks1=await Task.find({completed:'false'})
    const tasks2=await Task.find({completed:'true'})
    //res.send({token})
    res.send({user})
  }catch(e) {
    res.status(400).send()
  }
})

router.post('/emailupdate',auth,async(req,res)=>
{
  const oldemail=req.body.oldemail
  const newemail=req.body.newemail
  const password=req.body.password
  console.log(password)
  const user = await User.findByCredentials(req.user.email,req.body.password)
  user.email=oldemail
  try {
    if(user)
    {
      if(oldemail!=newemail)
      {
        throw new Error();
      }
      await user.save()
      req.flash('message','Email updated successfully')
      res.redirect('/settings')
    }
  }catch(e) {
    res.status(400).send()
  }
  
})

router.post('/passwordupdate',auth,async(req,res)=>
{
  const newpass=req.body.newpass
  console.log(req.body.oldpass)
  const user = await User.findByCredentials(req.user.email,req.body.oldpass)
  try {
    if(user)
    {
      user.password=newpass
      await user.save()
      req.flash('message','Password updated successfully')
      res.redirect('/settings')
    }
  }catch(e) {
    res.status(400).send()
  }
  
})


router.post('/users/logout', auth, async (req, res) => {
    try {
       req.user.tokens = req.user.tokens.filter((token) => {
         return token.token !== req.token
       })
       await req.user.save()
       res.send('logged')
    } catch (e) {
      res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })
  if(!isValidOperation){
    return res.status(400).send({error: 'Invalid Updates!'})
  }
  try{
      updates.forEach((update) => {
      req.user[update] = req.body[update]
    })
    await req.user.save()

    res.send(req.user)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try{
  await req.user.remove()
  res.status(200).send(req.user)
}catch(e){
  res.status(500).send()
}
})

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width : 250, height : 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send('uploaded')
}, (error, req, res, next) => {
  res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/image/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router
