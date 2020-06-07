const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const User =require('./models/user')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//edit


//require('dotenv').config({ path: require('find-config')('.env') })
const path = require('path');
const ejs=require('ejs')
const cors=require('cors')
const bodyParser=require('body-parser')
const cookieparser=require('cookie-parser')
//const expressLayouts=require('express-ejs-layouts')
// const flash=require('connect-flash')
 const session=require('express-session')
 const flash=require('connect-flash')
// const passport=require('passport')

// require('./config/passport')(passport);

//env
if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config()
}

// const stripeSecretKey=process.env.STRIPE_SECRET_KEY
// const stripePublicKey=process.env.STRIPE_PUBLIC_KEY
// console.log(stripeSecretKey, stripePublicKey)

const jwt=require('jsonwebtoken')
const app=express()
const multer=require('multer')



const port=process.env.PORT || 3000
//app.use(expressLayouts)






app.set('views', path.join(__dirname,'views'))
const public=path.join(__dirname,'../public')
//console.log(public);
app.use(cookieparser())

app.set('view engine','ejs')
app.use(express.json())
app.use(express.static(public)); 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 
    extended:true
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }))
app.use(flash())

  // app.use(passport.initialize());
  // app.use(passport.session());

//   app.use(flash())

//   app.use((req,res,next)=>
//   {
//       res.locals.success_msg=req.flash('success_msg');
//       res.locals.error_msg=req.flash('error_msg');
//   })






//edit

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () =>{
  console.log('Server is on port', port)
})
