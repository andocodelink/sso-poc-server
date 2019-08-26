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
const SESSION_CONFIG = {
  key: 'SESSIONID', 
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false
};
app.use(session(SESSION_CONFIG, app))

// Middleware
app.use(bodyParser())
const CORS_CONFIG = {
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: false,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}
app.use(cors(CORS_CONFIG))

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
  console.log(chalk.cyan(chalk.bold('app is listening on port 3002')))
})

module.exports = server
