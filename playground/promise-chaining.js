require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5d10d87cf535732b6463447b', { age: 21}).then((user) => {
//   console.log(user)
//   return User.countDocuments({ age: 21})
// }).then((result) => {
//   console.log(result)
// }).catch((error) => {
//   console.log(error)
// })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {age: age})
  const count = await User.countDocuments({age: age})
  return count
}

updateAgeAndCount('5d11ac5ac4c54744d4ead225', 21).then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})
