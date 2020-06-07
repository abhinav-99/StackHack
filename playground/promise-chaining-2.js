require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5d120080942c664cfc779834').then((task) => {
//   return Task.countDocuments({completed : false})
// }).then((result) => {
//   console.log(result)
// }).catch((error) => {
//   console.log(error)
// })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({completed: false})
  return count
}

deleteTaskAndCount('5d119d5a9e5b5437f8d78abd').then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})
