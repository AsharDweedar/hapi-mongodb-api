require('dotenv').config()
const Hapi = require('hapi')
const { conn } = require('./db/mongoose.js')

const init = async () => {
  // const server = Hapi.server({
  //   port: process.env.PORT || 5000,
  //   host: process.env.HOST || 'localhost'
  // })
  const server = new Hapi.Server(+process.env.PORT, '0.0.0.0');
  server.log()

  console.log('db starting')
  await conn
  console.log('db started')

  console.log('calling routes')
  const routes = require('./server/routes.js')
  routes.map(rout => server.route(rout))

  console.log('starting the server')
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log('unhandledRejection : ', err)
  process.exit(1)
})

init()
