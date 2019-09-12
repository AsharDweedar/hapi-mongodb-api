// const actor = require('./actor')
// const director = require('./director')
// const movie = require('./movie')

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

ActorSchema.plugin(mongoosastic, {
  host: 'search-nestrom-playground1-pe3bbwxgkncelmmg6u3d45exdq.eu-west-1.es.amazonaws.com',
  protocol: 'https',
  curlDebug: true
})

DirectorSchema.plugin(mongoosastic, {
  host: 'search-nestrom-playground1-pe3bbwxgkncelmmg6u3d45exdq.eu-west-1.es.amazonaws.com',
  protocol: 'https',
  curlDebug: true
})

MovieSchema.plugin(mongoosastic, {
  host: 'search-nestrom-playground1-pe3bbwxgkncelmmg6u3d45exdq.eu-west-1.es.amazonaws.com',
  populate: [
    { path: 'actor', select: 'name age facebook_page_link' },
    { path: 'director', select: 'name age' }
  ],
  protocol: 'https',
  curlDebug: true
})

var movie = mongoose.model('movie', MovieSchema)
var director = mongoose.model('director', DirectorSchema)
var actor = mongoose.model('actor', ActorSchema)

doer(movie)
doer(director)
doer(actor)

var DB = {
  actor,
  director,
  movie
}

module.exports = DB

function doer (schema) {
  schema.createMapping(function (err, mapping) {
    if (err) {
      console.log('error creating mapping (you can safely ignore this)')
      console.log(err)
    } else {
      console.log('mapping created!')
      console.log(mapping)
    }
  })
  var stream = schema.synchronize(function (err, data) {
    console.log('schema.synchronize err : ', err)
    console.log('schema.synchronize data : ', data)
  })
  var count = 0

  stream.on('data', (err, doc) => {
    console.log('on data , err : ', err)
    console.log('on data , doc : ', doc)
    count++
  })

  stream.on('close', () => console.log('indexed ' + count + ' documents!'))
  stream.on('error', err => console.log('err with sync : ', err))
}
