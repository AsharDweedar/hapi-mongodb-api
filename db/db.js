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
      ref: 'actor',
      es_schema: ActorSchema,
      es_indexed: true,
      es_select: 'name facebook_page_link'
    }
  ],
  director: {
    type: Schema.Types.ObjectId,
    ref: 'director',
    es_schema: DirectorSchema,
    es_indexed: true,
    es_select: 'name'
  },
  color: String
})

// ActorSchema.plugin(mongoosastic, {
//   hosts: [
//     'search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com',
//     'https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com/_plugin/kibana/'
//   ],
//   protocol: 'https',
//   curlDebug: true
// })

// DirectorSchema.plugin(mongoosastic, {
//   hosts: [
//     'search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com',
//     'https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com/_plugin/kibana/'
//   ],
//   protocol: 'https',
//   curlDebug: true
// })

MovieSchema.plugin(mongoosastic, {
  hosts: [
    'search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com',
    'https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com/_plugin/kibana/'
  ],
  populate: [
    { path: 'actors', select: 'name facebook_page_link' },
    { path: 'directors', select: 'name' }
  ],
  protocol: 'https',
  curlDebug: true
})

var movies = mongoose.model('movie', MovieSchema)
var directors = mongoose.model('director', DirectorSchema)
var actors = mongoose.model('actor', ActorSchema)

// ;(async function () {
//   // await doer(actors)
//   // await doer(directors)
//   await doer(movies)
// })()

var DB = {
  actors,
  directors,
  movies
}

module.exports = DB

// function doer (schema) {
//   return new Promise(function (resolve, reject) {
//     console.log('start sync !')
//     var stream = schema.synchronize(function (err, data) {
//       console.log('schema.synchronize err : ', err)
//       console.log('schema.synchronize data : ', data)
//     })
//     var count = 0

//     stream.on('error', err => {
//       console.log('err with sync : ', err)
//       reject()
//     })

//     stream.on('data', (err, doc) => {
//       console.log('on data , err : ', err)
//       console.log('on data , doc : ', doc)
//       count++
//     })

//     stream.on('close', () => {
//       console.log('indexed ' + count + ' documents!')
//       // schema.createMapping(function (err, mapping) {
//       //   // if (err && !err.message.includes('resource_already_exists_exception')) {
//       //   if (err) {
//       //     // && !err.message.includes('resource_already_exists_exception')) {
//       //     console.log('error creating mapping (you can safely ignore this)')
//       //     console.log(err)
//       //   }
//       //   console.log('mapping created!')
//       //   console.log(mapping)
//       //   resolve()
//       // })
//     })
//   })
// }
