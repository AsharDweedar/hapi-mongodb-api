const DB = require('../db/db')
module.exports = [
  {
    method: 'GET',
    path: '/api/run',
    handler: (req, res) => {
      let exec = require('../db/seed/script')
      exec()
      return 'running'
    }
  },
  {
    method: 'GET',
    path: '/api/dbSync',
    handler: (req, res) => {
      return new Promise(function (resolve, reject) {
        try {
          console.log('start sync !')
          var stream = DB.movies.synchronize()
          var count = 0

          stream.on('error', err => {
            reject('err with sync : ', JSON.stringify(err))
          })

          stream.on('data', (err, doc) => {
            console.log(count++)
          })

          stream.on('close', () => {
            resolve('indexed ' + count + ' documents!')
          })
        } catch (error) {
          console.log('catch error in sync :', error)
        }
      })
    }
  },
  {
    method: 'GET',
    path: '/api/mapping',
    handler: async (req, res) => {
      DB.movies.createMapping(function (err, mapping) {
        if (err && !err.message.includes('resource_already_exists_exception')) {
          // if (err) {
          console.log('error creating mapping (you can safely ignore this)')
          return console.log(err)
        }
        console.log('mapping created!')
        console.log(mapping)
      })

      return 'mapping !!'
    }
  },
  {
    method: 'GET',
    path: '/api/{schema}/search',
    handler: async (req, res) => {
      let q = req.query
      var query = { bool: { must: [] } }
      if (q['title']) {
        query.bool.must.push({ match: { title: `${q['title']}` } })
      }
      if (q['genres']) {
        query.bool.must.push({ match: { genres: JSON.stringify(q['genres']) } })
      }
      if (q['plot_keywords']) {
        query.bool.must.push({
          match: { plot_keywords: JSON.stringify(q['plot_keywords']) }
        })
      }

      return new Promise((resolve, reject) => {
        DB.movies.search(query, function (err, result) {
          if (err) {
            console.log('search movies >> ', err, '++', result)
            return resolve([])
          }
          console.log('search movies success')
          resolve(result.hits.hits)
        })
      })
    }
  },
  {
    method: 'GET',
    path: '/api/movies/count',
    handler: (req, res) => {
      let q = req.query
      // ?language=lang&country=country&imdb_from=0&imdb_to=100
      return new Promise(function (resolve, reject) {
        var query = { bool: { must: [] } }
        if (q['language']) {
          query.bool.must.push({ match: { language: `${q['language']}` } })
        }
        if (q['country']) {
          query.bool.must.push({ match: { country: `${q['country']}` } })
        }
        if (!!q['imdb_from'] && !!q['imdb_to']) {
          query['bool']['should'] = {
            range: {
              imdb_score: {
                from: Number.parseInt(q['imdb_from']),
                to: Number.parseInt(q['imdb_to'])
              }
            }
          }
        }
        DB.movies.search(query, function (err, result) {
          if (err) {
            console.log('DB.movies.search with range (err) ', err)
            return resolve({ count: 0 })
          }
          console.log('DB.movies.search with range (res) ')
          resolve({ count: result.hits.hits.length })
        })
      })
    }
  },
  {
    method: 'GET',
    path: '/api/movies/all',
    handler: (req, res) => {
      // TODO: extract common function between this endpoint and the search endpoint
      let q = req.query
      var query = { bool: { must: [] } }
      if (q['genres']) {
        query.bool.must.push({ match: { genres: JSON.stringify(q['genres']) } })
      }
      if (q['plot_keywords']) {
        query.bool.must.push({
          match: { plot_keywords: JSON.stringify(q['plot_keywords']) }
        })
      }

      return new Promise((resolve, reject) => {
        DB.movies.search(query, function (err, result) {
          if (err) {
            console.log('**************************', err, '++', result)
            return resolve([])
          }
          resolve(result.hits.hits)
        })
      })
    }
  },
  {
    method: 'GET',
    path: '/api/{schema}',
    handler: (req, res) => {
      let schema = req.params.schema
      if (['actors', 'directors', 'movies'].includes(`${schema}`)) {
        return DB[schema].find({}).map(ele => ele)
      }
      return 'get data of one of the schemas (actors, directors, movies)'
    }
  },
  {
    method: 'GET',
    path: '/api/{schema}/{id}',
    handler: (req, res) => {
      let schema = req.params.schema
      if (['actors', 'directors', 'movies'].includes(`${schema}`)) {
        return DB[schema].find({ _id: req.params.id }).map(ele => ele)
      }
      return 'get data of one doc from schema: (actors, directors, movies)'
    }
  },
  {
    method: 'POST',
    path: '/api/{schema}',
    handler: (req, handler) => {
      let schema = req.params.schema

      if (['actors', 'directors', 'movies'].includes(schema)) {
        var data = new DB[schema](req.payload)
        return new Promise(function (resolve, reject) {
          data.save(function (err, doc) {
            console.log('save callback ')
            if (err) return reject(JSON.stringify(err))
            doc.on('es-indexed', function (err, res) {
              if (err) {
                doc.index(function (err, res) {
                  console.log("I've been indexed!", res, 'or not ? ', err)
                })
                return console.log('err indexing : ', err)
              }
              console.log('res is indexed : ', res)
            })
            resolve(doc)
          })
        })
      }
      return 'insert data in one of the schemas (actors, directors, movies)'
    }
  },
  {
    method: 'PUT',
    path: '/api/{schema}/{id}',
    handler: async (req, res) => {
      let schema = req.params.schema

      if (['actors', 'directors', 'movies'].includes(schema)) {
        let doc = await DB[schema].find({ _id: req.params.id }).map(ele => ele)
        doc = doc.length ? doc[0] : null
        console.log('find : ', doc)
        if (doc) {
          for (let key of Object.keys(req.payload)) {
            doc[key] = req.payload[key]
          }
          console.log(doc)
          let saved = await doc.save()

          saved.index(function (err, res) {
            console.log("I've been indexed!", res, 'or not ? : ', err)
          })

          return saved
        }
      }
      return 'update data at one of the schemas (actors, directors, movies)'
    }
  },
  {
    method: 'DELETE',
    path: '/api/{schema}/{id}',
    handler: (req, handler) => {
      let schema = req.params.schema
      let id = req.params.id

      if (['actors', 'directors', 'movies'].includes(schema)) {
        return new Promise(async function (resolve, reject) {
          let doc = await DB[schema].find({ _id: id }).map(ele => ele)
          console.log(doc)
          if (!doc.length) return resolve('document not found')
          doc = doc[0]

          doc.remove(function (err, res) {
            if (err) return reject(err)
            try {
              doc.index = 'movies'
              doc._index = 'movies'
              doc.id = id
              console.log(doc)
              doc.on('es-removed', function (err, res) {
                console.log('es-removed err', err, 'es-removed res', res)
                if (err) {
                }
              })
            } catch (error) {
              console.log('error with try catch : ', error)
            }
            resolve(`Documents removed : ${res}`)
          })
        })
      }
      return 'delete data from one of the schemas (actors, directors, movies)'
    }
  }
]
