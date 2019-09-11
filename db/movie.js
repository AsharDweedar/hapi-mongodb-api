var { mongoose } = require('./mongoose.js')
var mongoosastic = require('mongoosastic')
var Schema = mongoose.Schema

var MovieSchema = new Schema({
  title: { type: String, es_indexed: true }, // 1
  duration: Number,
  gross: String,
  genres: [{ type: String, es_indexed: true }], // 1 , 3
  favs: Number,
  num_voted_users: Number,
  cast_total_facebook_likes: Number,
  plot_keywords: [{ type: String, es_indexed: true }], // 1, 3
  imdb_link: { type: String, es_indexed: true }, // 2
  num_user_for_reviews: Number,
  language: { type: String, es_indexed: true }, // 2
  country: { type: String, es_indexed: true }, // 2
  content_rating: Number,
  budget: Number,
  title_year: Number,
  imdb_score: Number,
  aspect_ratio: Number,
  movie_facebook_likes: Number,
  actors: [String],
  director: String,
  color: String
})

MovieSchema.plugin(mongoosastic, {
  host:
    'search-nestrom-playground1-pe3bbwxgkncelmmg6u3d45exdq.eu-west-1.es.amazonaws.com',
  protocol: 'https',
  curlDebug: true
})

var movie = mongoose.model('movie', MovieSchema)

movie.createMapping(function (err, mapping) {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)')
    console.log(err)
  } else {
    console.log('mapping created!')
    console.log(mapping)
    console.log('starting the search')
    movie.search({ query: 'geners' }, function (err, results) {
      console.log('search elastic ...........')
      console.log('err : ', err)
      console.log('result : ', results)
    })
  }
})

module.exports = movie
