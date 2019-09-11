const DB = require('../db/db')
module.exports = [
  {
    method: 'GET',
    path: '/api/movie/search',
    handler: async (req, res) => {
      console.log('req.query : ', req.query)
      return new Promise((resolve, reject) => {
        // DB.movie.search({ query_string: { query: req.query.title } }, function (
        //   err,
        //   result
        // ) {
        //   if (err) {
        //     console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrr', err)
        //     return resolve(JSON.stringify(err))
        //     // return reject(err)
        //   }
        //   console.log('ressssssssssssssssssssssssss')
        //   resolve(result)
        // })
        DB.client
          .search({
            q: 'title'
          })
          .then(
            function (body) {
              var hits = body.hits.hits
              resolve(hits)
            },
            function (error) {
              console.trace(error.message)
              resolve(JSON.stringify(error))
            }
          )
      })
      // return 'Route to search movies by title, genres, and plot keywords'
    }
  },
  {
    method: 'GET',
    path: '/api/movie/count',
    handler: (req, res) => {
      return 'Route to get movies count by language, country and IMDB score (the IMDB score should be a range)'
    }
  },
  {
    method: 'GET',
    path: '/api/movie/all',
    handler: (req, res) => {
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  },
  {
    method: 'GET',
    path: '/api/{schema}',
    handler: (req, res) => {
      let schema = req.params.schema
      if (['actor', 'director', 'movie'].includes(`${schema}`)) {
        let data = DB[schema].find({}).map(ele => ele)
        return data
      }
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  },
  {
    method: 'POST',
    path: '/api/{schema}',
    handler: (req, res) => {
      let schema = req.params.schema

      if (['actor', 'director', 'movie'].includes(schema)) {
        var data = new DB[schema](req.payload)
        data.on('es-indexed', function (err, res) {
          if (err) console.log('err with indexing new doc : ', err)
          console.log('res is indexed : ', res)

          /* Document is indexed */
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

      if (['actor', 'director', 'movie'].includes(schema)) {
        // TODO: update
        let res = await DB[schema].findOneById(req.params.id)
        console.log('findOneById : ', res)
        return await JSON.stringify(Object.assign(res, req.payload).save())
        // return 'Create CRUDs RESTful APIs for all schemas mentioned above'
      }
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  },
  {
    method: 'DELETE',
    path: '/api/{schema}/{id}',
    handler: (req, res) => {
      let schema = req.params.schema

      if (['actor', 'director', 'movie'].includes(schema)) {
        return DB[schema].findByIdAndRemove(req.params.id)
        // return 'Create CRUDs RESTful APIs for all schemas mentioned above'
      }
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  }
]
