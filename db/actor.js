var { mongoose } = require('./mongoose.js')
var Schema = mongoose.Schema

var ActorSchema = new Schema({
  name: String,
  facebook_likes: Number,
  age: Number,
  facebook_page_link: String
})
var actor = mongoose.model('actor', ActorSchema)
module.exports = actor
