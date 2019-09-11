var { mongoose } = require('./mongoose.js')
var Schema = mongoose.Schema
var mongoosastic = require('mongoosastic')

var DirectorSchema = new Schema({
  name: String,
  facebook_likes: Number,
  age: Number,
  username: String,
  password: String
})

DirectorSchema.plugin(mongoosastic, {
  host:
    'search-nestrom-playground1-pe3bbwxgkncelmmg6u3d45exdq.eu-west-1.es.amazonaws.com',
  protocol: 'https',
  curlDebug: true
})

var director = mongoose.model('director', DirectorSchema)

// director.createMapping(function (err, mapping) {
//   if (err) {
//     console.log('error creating mapping (you can safely ignore this)')
//     console.log(err)
//   } else {
//     console.log('mapping created!')
//     console.log(mapping)
//   }
// })
// var stream = director.synchronize(function (err, data) {
//   console.log('director.synchronize err : ', err)
//   console.log('director.synchronize data : ', data)
// })
// var count = 0

// stream.on('data', (err, doc) => {
//   console.log('on data , err : ', err)
//   console.log('on data , doc : ', doc)
//   count++
// })
// stream.on('close', () => console.log('indexed ' + count + ' documents!'))
// stream.on('error', err => console.log('err with sync : ', err))

module.exports = director
