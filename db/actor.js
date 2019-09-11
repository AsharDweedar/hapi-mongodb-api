var { mongoose } = require('./mongoose.js')
var Schema = mongoose.Schema
var mongoosastic = require('mongoosastic')

var ActorSchema = new Schema({
  name: String,
  facebook_likes: Number,
  age: Number,
  facebook_page_link: String
})

ActorSchema.plugin(mongoosastic, {
  host:
    'search-nestrom-playground1-pe3bbwxgkncelmmg6u3d45exdq.eu-west-1.es.amazonaws.com',
  protocol: 'https',
  curlDebug: true
})

var actor = mongoose.model('actor', ActorSchema)

// actor.createMapping(function (err, mapping) {
//   if (err) {
//     console.log('error creating mapping (you can safely ignore this)')
//     console.log(err)
//   } else {
//     console.log('mapping created!')
//     console.log(mapping)
//   }
// })
// var stream = actor.synchronize(function (err, data) {
//   console.log('actor.synchronize err : ', err)
//   console.log('actor.synchronize data : ', data)
// })
// var count = 0

// stream.on('data', (err, doc) => {
//   console.log('on data , err : ', err)
//   console.log('on data , doc : ', doc)
//   count++
// })
// stream.on('close', () => console.log('indexed ' + count + ' documents!'))
// stream.on('error', err => console.log('err with sync : ', err))

module.exports = actor
