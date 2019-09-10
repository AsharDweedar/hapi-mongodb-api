var { mongoose } = require('./mongoose.js')
var Schema = mongoose.Schema

var MovieSchema = new Schema({
  title: String,
  duration: Number,
  gross: String,
  genres: [String],
  favs: Number,
  num_voted_users: Number,
  cast_total_facebook_likes: Number,
  plot_keywords: [String],
  imdb_link: String,
  num_user_for_reviews: Number,
  language: String,
  country: String,
  content_rating: String,
  budget: String,
  title_year: String,
  imdb_score: Number,
  aspect_ratio: Number,
  movie_facebook_likes: Number,
  actors: [String],
  director: String,
  color: String
})
var movie = mongoose.model('movie', MovieSchema)
module.exports = movie
