import Koa from 'koa'
import convert from 'koa-convert'
import webpack from 'webpack'
import webpackConfig from '../build/webpack.config'
import historyApiFallback from 'koa-connect-history-api-fallback'
import serve from 'koa-static'
import proxy from 'koa-proxy'

import _debug from 'debug'
import config from '../config'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import monk from 'monk'
import wrap from 'co-monk'
const db = monk('localhost/NextFlick')
const movies = wrap(db.get('movies'))
const actors = wrap(db.get('actors'))
const directors = wrap(db.get('directors'))
const genres = wrap(db.get('genres'))
const conflicts = wrap(db.get('conflicts'))
const affiliations = wrap(db.get('affiliations'))
const locations = wrap(db.get('locations'))

const debug = _debug('app:server')
const paths = config.utils_paths
const app = new Koa()
const router = require('koa-router')()
const bodyParser = require('koa-body-parser')

router.get('/api/whatever', function *() {
  const result = yield movies.find({})
  this.body = result
})

router.post('/api/movies', function *() {
  yield insertMovies(this.request.body)
  const result = yield movies.find({})
  this.body = result
})

router.get('/api/actors', function *() {
  const result = yield actors.find({})
  this.body = result
})

router.get('/api/genres', function *() {
  const result = yield genres.find({})
  this.body = result
})

router.get('/api/conflicts', function *() {
  const result = yield conflicts.find({})
  this.body = result
})
router.get('/api/locations', function *() {
  const result = yield locations.find({})
  this.body = result
})

router.get('/api/affiliations', function *() {
  const result = yield affiliations.find({})
  this.body = result
})

router.post('/api/actors', function *() {
  yield insertActors(this.request.body)
  const result = yield actors.find({})
  this.body = result
})

router.post('/api/directors', function *() {
  yield insertDirectors(this.request.body)
  const result = yield directors.find({})
  this.body = result
})

router.post('/api/genres', function *() {
  yield insertGenres(this.request.body)
  const result = yield genres.find({})
  this.body = result
})

router.post('/api/conflicts', function *() {
  yield insertConflicts(this.request.body)
  const result = yield conflicts.find({})
  this.body = result
})

router.post('/api/locations', function *() {
  yield insertLocations(this.request.body)
  const result = yield locations.find({})
  this.body = result
})

router.post('/api/affiliations', function *() {
  yield insertAffiliations(this.request.body)
  const result = yield affiliations.find({})
  this.body = result
})

router.post('/api/saveMovie', function *() {
  yield saveMovie(this.request.body)
  const result = yield movies.find({})
  this.body = result
})
router.post('/api/editMovie', function *() {
  yield editMovie(this.request.body)
  const result = yield movies.find({})
  this.body = result
})

router.get('/api/directors', function *() {
  const result = yield directors.find({})
  this.body = result
})

const insertMovies = function *(data) {
  return data.map(movie => {
    movies.find({Movie: movie.Movie}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      movies.update({Movie: movie.Movie}, movie)
      if (entry.length === 0) {
        movies.insert(movie)
      }
    })
  })
}

const saveMovie = function *(data) {
  console.log(data)
  return data.map(movie => {
    movies.find({Movie: movie.Movie}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      if (entry.length === 0) {
        movies.insert(movie)
      }
    })
  })
}

const editMovie = function *(data) {
  console.log(data)
  return data.map(movie => {
    movies.find({Movie: movie.Movie}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      if (entry.length === 1) {
        movies.update({Movie: movie.Movie}, movie)
      }
    })
  })
}

const insertActors = function *(data) {
  console.log(data)
  return data.map(actor => {
    actors.find({name: actor.name}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      actors.update({name: actor.name}, actor)
      if (entry.length === 0) {
        actors.insert(actor)
      }
    })
  })
}

const insertDirectors = function *(data) {
  console.log(data)
  return data.map(director => {
    directors.find({name: director.name}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      directors.update({name: director.name}, director)
      if (entry.length === 0) {
        directors.insert(director)
      }
    })
  })
}

const insertAffiliations = function *(data) {
  console.log(data)
  return data.map(aff => {
    affiliations.find({name: aff.name}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      affiliations.update({name: aff.name}, aff)
      if (entry.length === 0) {
        affiliations.insert(aff)
      }
    })
  })
}

const insertLocations = function *(data) {
  console.log(data)
  return data.map(locc => {
    locations.find({name: locc.name}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      locations.update({name: locc.name}, locc)
      if (entry.length === 0) {
        locations.insert(locc)
      }
    })
  })
}

const insertGenres = function *(data) {
  console.log(data)
  return data.map(gen => {
    genres.find({name: gen.name}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      genres.update({name: gen.name}, gen)
      if (entry.length === 0) {
        genres.insert(gen)
      }
    })
  })
}

const insertConflicts = function *(data) {
  console.log(data)
  return data.map(conf => {
    conflicts.find({name: conf.name}, function (err, entry) {
      if (err) {
        console.log('Error in first query')
        // return res.status(500).send('Something went wrong getting the data')
      }
      conflicts.update({name: conf.name}, conf)
      if (entry.length === 0) {
        conflicts.insert(conf)
      }
    })
  })
}

app.use(bodyParser())
app.use(router.routes())
// Enable koa-proxy if it has been enabled in the config.
if (config.proxy && config.proxy.enabled) {
  app.use(convert(proxy(config.proxy.options)))
}

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: false
})))

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output

  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(serve(paths.client('static')))
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(serve(paths.dist()))
}

export default app
