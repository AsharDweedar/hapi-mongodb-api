var { mongoose } = require('./mongoose.js')
var Schema = mongoose.Schema

var DirectorSchema = new Schema({
  name: String,
  facebook_likes: Number,
  age: Number,
  username: String,
  password: String
})
var director = mongoose.model('director', DirectorSchema)
module.exports = director
