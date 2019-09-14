require('dotenv').config()
const Hapi = require('hapi')
const { conn } = require('./db/mongoose.js')

const init = async () => {
  const server = Hapi.server({
    port: ~~process.env.PORT,
    host: process.env.HOST
  })
  // var server = new Hapi.Server(~~process.env.PORT || 3000, '0.0.0.0')

  server.log()

  console.log('db starting')
  await conn
  console.log('db started')

  console.log('calling routes')
  const routes = require('./server/routes.js')
  server.route(routes)

  console.log('starting the server')
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log('unhandledRejection : ', err)
  process.exit(1)
})

init()
