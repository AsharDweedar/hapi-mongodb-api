const actor = require('./actor')
const director = require('./director')
const movie = require('./movie')

var DB = {
  actor,
  director,
  movie
}

module.exports = DB
