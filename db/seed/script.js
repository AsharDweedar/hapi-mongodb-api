const csv = require('csv-parser')
const fs = require('fs')
const DB = require('../db')

function parser (str) {
  let n = Number.parseInt(str)
  return n || undefined
}

function parserf (str) {
  let n = Number.parseFloat(str)
  return n || undefined
}

function splitter (str) {
  if (str.length == 0) return []
  return str.split('|')
}

module.exports = function () {
  var indexed = 0
  var indexed_failed = 0
  var rows = []

  fs.createReadStream('./db/seed/data.csv')
    .pipe(csv())
    .on('data', row => rows.push(row))
    .on('end', async () => {
      console.log('CSV file successfully processed')
      for (let j = 0; j < rows.length; j++) {
        let row = rows[j]

        var director = { _id: undefined }
        if (row['director_name'] && row['director_name'] != '') {
          var found = await DB.directors.find({ name: row['director_name'] })
          if (found.length != 0) {
            console.log('found old director : ', found[0])
            director_doc = found[0]
          } else {
            director_doc = new DB.directors({
              name: row['director_name'],
              facebook_likes: row['director_facebook_likes']
            })

            console.log('saving director : ', await director_doc.save())
          }
          director = director_doc._id
        }

        let actors = []
        for (let i = 1; i <= 3; i++) {
          if (row[`actor_${i}_name`] && row[`actor_${i}_name`] != '') {
            var found = await DB.actors.find({ name: row[`actor_${i}_name`] })
            if (found.length != 0) {
              actors.push(found[0]._id)
            } else {
              let actor = new DB.actors({
                name: row[`actor_${i}_name`],
                facebook_likes: parser(row[`actor_${i}_facebook_likes`])
              })
              console.log('save actor : ', await actor.save())
              actors.push(actor._id)
            }
          }
        }

        var found = await DB.movies.find({ title: row['movie_title'].trim() })
        if (found.length != 0) {
          console.log('found old movie : ', found[0])
          console.log('already exists')
          found[0].index(function (err, res) {
            console.log("I've been indexed!", res, ', ..... or not ? ', err)
            if (err) console.log(++indexed_failed)
            if (!err) console.log(++indexed)
          })
        } else {
          let doc = new DB.movies({
            title: row['movie_title'].trim(), // 1
            duration: parser(row['duration']),
            gross: parser(row['gross']),
            genres: splitter(row['genres']), // 1 , 3
            // favs: Number, removed: no value
            num_voted_users: parser(row['num_voted_users']),
            cast_total_facebook_likes: parser(row['cast_total_facebook_likes']),
            plot_keywords: splitter(row['plot_keywords']), // 1 , 3
            imdb_link: row['movie_imdb_link'].trim(), // 2
            num_user_for_reviews: parser(row['num_user_for_reviews']),
            language: row['language'].trim(),
            country: row['country'].trim(),
            content_rating: row['content_rating'].trim(),
            budget: parser(row['budget']),
            title_year: parser(row['title_year']),
            imdb_score: parserf(row['imdb_score']),
            aspect_ratio: parserf(row['aspect_ratio']),
            movie_facebook_likes: parser(row['movie_facebook_likes']),
            color: row['color'].trim(),
            actors: actors,
            director: director._id,
            // added : not in the task description
            num_critic_for_reviews: row['num_critic_for_reviews'].trim(),
            facenumber_in_poster: row['facenumber_in_poster'].trim()
          })
          console.log('doc : ', doc)
          await doc.save()
          doc.on('es-indexed', function (err, res) {
            if (err) {
              console.log('err indexing : ', err)
              return doc.index(function (err, res) {
                console.log("I've been indexed!", res, ', ..... or not ? ', err)
                if (err) console.log(++indexed_failed)
                if (!err) console.log(++indexed)
              })
            }
            console.log('res is indexed : ', ++indexed, res)
          })
        }
      }
    })
}
