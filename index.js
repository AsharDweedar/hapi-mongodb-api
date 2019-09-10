require('dotenv').config()
const Hapi = require('hapi')
const routes = require('./server/routes.js')
const { conn } = require('./db/mongoose.js')

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost'
  })

  console.log('db starting')
  await conn
  console.log('db started')

  console.log('calling routes')
  routes.map(rout => server.route(rout))

  console.log('starting the server')
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
