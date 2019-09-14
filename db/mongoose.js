const mongoose = require('mongoose')
const url = process.env.MONGO_LINK || ''

let conn = mongoose.connect(
  // "mongodb://localhost:3001/nestrom",
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

module.exports = { conn, mongoose }
