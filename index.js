const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const passport = require('koa-passport')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const logger = require('koa-logger')

const chalk = require('chalk')

const app = new Koa()

// Log to terminal
app.use(logger())

// Session
app.keys = ['serect']
app.use(session(app))

// Middleware
app.use(bodyParser())
app.use(cors())

// Auth
require('./auth')
app.use(passport.initialize())
app.use(passport.session())

// Handle errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

const router = new Router()
require('./routes/basic')(router)

app.use(router.routes())
app.use(router.allowedMethods())

const server = app.listen(3002, () => {
  console.log(chalk.cyan(chalk.bold('app is listening on port 3001')))
})

module.exports = server
