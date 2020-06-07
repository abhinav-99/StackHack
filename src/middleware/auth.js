const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try{
    console.log(req.header)
    console.log('this is an auth function')
    //const token = req.header('Authorization').replace('Bearer', '')
    const token=req.cookies["id"]
    console.log(req.cookies)
    // console.log('ankit')
    console.log(token)
    // const header1 = req.headers['Authorization'];

    // if(typeof header1 != 'undefined') {
    //     console.log('undefined')
    //     const bearer = header1.split(' ');
    //     const token = bearer[1];
    // }
    // const decoded=jwt.verify(token, 'thisismyproject')
       
        // const user=await User.findOne({_id: decoded._id,'tokens.token':token})
        // if(!user)
        // {
           
        //     throw new Error()
        // }
        // req.user=user
        
        // next()
    const decoded = jwt.verify(token, 'thisismynewcourse')
    const user = await User.findOne({_id: decoded._id, 'tokens.token' : token})

    if(!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  } catch (e) {
    res.redirect('/login')
  }
}

module.exports = auth
