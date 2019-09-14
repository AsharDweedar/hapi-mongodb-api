var { mongoose } = require('./mongoose.js')
var Schema = mongoose.Schema
var mongoosastic = require('mongoosastic')

var ActorSchema = new Schema({
  name: String,
  facebook_likes: Number,
  age: Number,
  facebook_page_link: String
})

var DirectorSchema = new Schema({
  name: String,
  facebook_likes: Number,
  age: Number,
  username: String,
  password: String
})

var MovieSchema = new Schema({
  title: String, // 1
  duration: Number,
  gross: String,
  genres: [String], // 1 , 3
  favs: Number,
  num_voted_users: Number,
  cast_total_facebook_likes: Number,
  plot_keywords: [String], // 1, 3
  imdb_link: String, // 2
  num_user_for_reviews: Number,
  language: String, // 2
  country: String, // 2
  content_rating: Number,
  budget: Number,
  title_year: Number,
  imdb_score: Number,
  aspect_ratio: Number,
  movie_facebook_likes: Number,
  actors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'actor'
    }
  ],
  director: {
    type: Schema.Types.ObjectId,
    ref: 'director'
  },
  color: String
})

MovieSchema.plugin(mongoosastic, {
  hosts: [
    'search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com',
    'https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com/_plugin/kibana/'
  ],
  populate: [
    { path: 'actors', select: 'name facebook_page_link' },
    { path: 'director', select: 'name username' }
  ],
  protocol: 'https',
  curlDebug: true
})

var actors = mongoose.model('actor', ActorSchema)
var directors = mongoose.model('director', DirectorSchema)
var movies = mongoose.model('movie', MovieSchema)

var DB = {
  actors,
  directors,
  movies
}

module.exports = DB
