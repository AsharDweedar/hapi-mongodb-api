**Stack:**

- Hapi as a framework
- mongoose as orm
- mongoosastic as elastic search plugin

**Start The App:**

- `npm install`
- define env:

  * HOST=localhost
  * PORT=3000
  * MONGO_LINK=mongodb+srv://admin:admin_123@nestrom-playground1-hofdl.mongodb.net/test?retryWrites=true&w=majority

- `npm start`

**Postman Collection:**

- link: https://www.getpostman.com/collections/5cba874191d68181cf56
- each endpoint has one successful example

**Notes on the data csv:**

- num_critic_for_reviews, facenumber_in_poster: both exist in the file but not in the schema description
- favs does not exist in the sheet

**Elastic search links:**

- Endpoint : https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com
- Kibana : https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com/_plugin/kibana/

**Endpoints:**

- GET: '/api/run' to run script handling the csv sheet

- GET: '/api/movies/search'

  - query params: ?title='title'&genres='genres'&plot_keywords='plot_keywords'

- GET: '/api/movies/count'

  - query params: ?language='language'&country='country'&imdb_from='imdb_from'&imdb_to='imdb_to'

- GET: '/api/movies/all'

  - query params: ?genres='genres'&plot_keywords='plot_keywords'
  - add size=n to specify the result's length

- GET: '/api/{schema}'

- GET: '/api/{schema}/{id}'

- POST: '/api/{schema}', body params: from schema fields

- PUT: '/api/{schema}/{id}', body params: from schema fields

- DELETE: '/api/{schema}/{id}'
