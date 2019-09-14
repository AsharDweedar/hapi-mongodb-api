Postman Collection link:
https://www.getpostman.com/collections/5cba874191d68181cf56

Elastic search links:

    - Endpoint : https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com
    - Domain ARN : arn:aws:es:us-east-2:870484560720:domain/nestrom-test
    - Kibana : https://search-nestrom-test-ro7mgh2c3l5hbg2dpuswitymgu.us-east-2.es.amazonaws.com/_plugin/kibana/

Endpoints:

    - GET: '/api/movies/search', query params: ?title='title'&genres='genres'&plot_keywords='plot_keywords'

    - GET: '/api/movies/count', query params: ?language='language'&country='country'&imdb_from='imdb_from'&imdb_to='imdb_to'

    - GET: '/api/movies/all', query params: ?genres='genres'&plot_keywords='plot_keywords'

    - GET: '/api/{schema}'

    - GET: '/api/{schema}/{id}'

    - POST: '/api/{schema}', body params: from schema fields

    - PUT: '/api/{schema}/{id}', body params: from schema fields

    - DELETE: '/api/{schema}/{id}'
