const DB = require('../db/db')
module.exports = [
  {
    method: 'GET',
    path: '/api/{schema}/search',
    handler: async (req, res) => {
      let schema = req.params.schema
      console.log('req.query : ', req.query)
      return new Promise((resolve, reject) => {
        DB[schema].search(
          { query_string: { query: req.query.title } },
          function (err, result) {
            if (err) {
              console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrr', err)
              return resolve(JSON.stringify(err))
            }
            console.log('ressssssssssssssssssssssssss')
            resolve(result)
          }
        )
      })
      // return 'Route to search schema by title, genres, and plot keywords'
    }
  },
  {
    method: 'GET',
    path: '/api/movies/count',
    handler: (req, res) => {
      // TODO: add query from params
      return new Promise(function (resolve, reject) {
        DB.movies.search(
          {
            range: { imdb_score: { from: 0, to: 100 } }
          },
          function (err, result) {
            if (err) {
              console.log('DB.movies.search with range ', err)
              return resolve(JSON.stringify(err))
            }
            console.log('DB.movies.search with range')
            resolve(result)
          }
        )
      })

      // return 'Route to get movies count by language, country and IMDB score (the IMDB score should be a range)'
    }
  },
  {
    method: 'GET',
    path: '/api/movies/all',
    handler: (req, res) => {
      // let q = req.query
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
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
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  },
  {
    method: 'POST',
    path: '/api/{schema}',
    handler: (req, handler) => {
      let schema = req.params.schema

      if (['actors', 'directors', 'movies'].includes(schema)) {
        var data = new DB[schema](req.payload)
        // console.log(data)
        // return new Promise(function (resolve, reject) {
        //   data.save(function (err, doc) {
        //     console.log('save callback ')
        //     if (err) return reject(JSON.stringify(err))
        //     doc.on('es-indexed', function (err, res) {
        //       if (err) return resolve(JSON.stringify(err))
        //       console.log('res is indexed : ', res)
        //       resolve(JSON.stringify(res))
        //     })
        //   })
        // })
        data.on('es-indexed', function (err, res) {
          if (err) return console.log('err with indexing new doc : ', err)
          console.log('res is indexed : ', res)
        })
        return data.save()
      }
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  },
  {
    method: 'PUT',
    path: '/api/{schema}/{id}',
    handler: async (req, res) => {
      let schema = req.params.schema

      if (['actors', 'directors', 'movies'].includes(schema)) {
        // TODO: update
        let res = await DB[schema].findOneById(req.params.id)
        console.log('findOneById : ', res)
        return JSON.stringify(await Object.assign(res, req.payload).save())
      }
      return 'Create CRUDs RESTful APIs for all schemas mentioned above'
    }
  },
  {
    method: 'DELETE',
    path: '/api/{schema}/{id}',
    handler: (req, handler) => {
      let schema = req.params.schema

      if (['actors', 'directors', 'movies'].includes(schema)) {
        return new Promise(function (resolve, reject) {
          DB[schema].findOneById(req.params.id, function (err, doc) {
            console.log('findOneById : ', doc)
            doc.remove(function (err) {
              if (err) return reject(JSON.stringify(err))
              doc.on('es-removed', function (err, res) {
                if (err) return resolve(JSON.stringify(err))
                resolve(res)
              })
            })
          })
        })
      }
      // return DB[schema].findByIdAndRemove(req.params.id)
      return 'Create CRUDs RESTful APIs for all schemas mentioned above'
    }
  }
]
