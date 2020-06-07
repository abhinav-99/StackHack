const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
  description : {
    type: String,
    trim: true,
    required: true
  },
  completed : {
    type:Number,
    default:0
  },
  duedate:{
    type:Date,
    required:true
  },
  label:
  {
    type:String,
    required:true
  },
  priority:
  {
    type:String,
    required:true
  },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'User' // required for populate
  }

}, {
  timestamps : true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
