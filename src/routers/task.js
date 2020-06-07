const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth');
const router = new express.Router()

router.get('/successpage',auth,async(req,res)=>
{
  const user=req.user
  res.render('success',{user})
})

router.post('/tasksadd', auth,async (req, res) => {
  //const tsk = new Task(req.body)
  console.log(req.body.task)
  const tsk = new Task({
    description:req.body.task,
    duedate:req.body.duedate,
    label:req.body.label,
    priority:req.body.prio, // copies request body
    owner : req.user._id
  })
  const user=req.user
  
  try{
    await tsk.save()
    const tasks1=await Task.find({completed:0,owner:req.user._id})
    const tasks2=await Task.find({completed:1,owner:req.user._id})
    req.flash('message','New task added')
    res.redirect('/users/taskpage')
  }catch(e) {
    res.status(400).send(error)
  }
})
router.get('/gettodo',async(req,res)=>
{
    const tasks=await Task.find({completed:'false'})
    res.send({tasks})  
})
// GET /tasks?completed=true
// GET /tasks?limit = 10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try{
    //const tsk = await Task.find({owner : req.user._id, completed : true}) alternate way
    //res.send(tsk)
    await req.user.populate({
      path : 'tasks',
       match,
       options : {
         limit: parseInt(req.query.limit),
         skip : parseInt(req.query.skip),
         sort
         // sort : {
         //   //createdAt: -1 // 1 for ascending
         //   completed: 1 // incomplete first
         // }
       }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try{
  const tsk = await Task.findOne({_id, owner: req.user._id})

  if(!tsk) {
    return res.status(404).send()
  }
    res.send(tsk)
  }catch(error){
    res.status(500).send()
  }
})

router.post('/updatetasks/:id',auth, async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOne({_id :id, owner : req.user._id})
  console.log(task)
  task.completed=1
  await task.save()
  res.redirect('/successpage')
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })
  if(!isValidOperation){
    return res.status(400).send({error: 'Invalid Updates!'})
  }
  const _id = req.params.id
  try{
    const task = await Task.findOne({_id : _id, owner : req.user._id})

    if(!task){
      return res.status(404).send()
    }
    updates.forEach((update) => {
      task[update] = req.body[update]
    })
    await task.save()

    res.send(task)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try{
  const _id = req.params.id
  const task = await Task.findOneAndDelete({_id, owner : req.user._id})
  if(!task){
    return res.status(404).send()
  }
  res.status(200).send(task)
}catch(e){
  res.status(500).send()
}
})


module.exports = router
