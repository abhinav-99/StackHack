//p4n1gPoJXApYiEFy
//mongodb+srv://abhi-kr:p4n1gPoJXApYiEFy@cluster0-plh2s.mongodb.net/test?retryWrites=true&w=majority
//mongodb+srv://ankit.8131:Coder123@cluster0-junxd.mongodb.net/test?retryWrites=true&w=majority


const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ankit8131:coder123@cluster0-junxd.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
// mongoose.connect('mongodb://127.0.0.1:27017/hackathon-api',{
//     useNewUrlParser:true,
//     useCreateIndex:true
// })

mongoose.connection.on('connected', () => {
  console.log('connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.log('Failed to connect MongoDB')
})