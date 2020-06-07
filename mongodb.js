// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'hackathon'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
  if(error){
   return console.log("unable to connect to database")
  }
  const db = client.db(databaseName)

  db.collection('tasks').deleteOne({
    description : 'exercise'
  }).then((result) => {
      console.log((result))
    }).catch((error) => {
      console.log(error)
    })
})
