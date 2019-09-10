const DB = require('../db/db')
module.exports = [
  {
    method: 'GET',
    path: '/api/movie/search',
    handler: (req, res) => {
      return 'Route to search movies by title, genres, and plot keywords'
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
        return data.save()
      }
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  },
  {
    method: 'PUT',
    path: '/api/{schema}',
    handler: (req, res) => {
      let schema = req.params.schema

      if (['actor', 'director', 'movie'].includes(schema)) {
        return 'Create CRUDs RESTful APIs for all schemas mentioned above'
      }
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  },
  {
    method: 'DELETE',
    path: '/api/{schema}',
    handler: (req, res) => {
      let schema = req.params.schema

      if (['actor', 'director', 'movie'].includes(schema)) {
        return 'Create CRUDs RESTful APIs for all schemas mentioned above'
      }
      return 'Route to get all movies with the ability to filter them by genres and plot keywords'
    }
  }
]
