const passport = require('koa-passport')
const LocalStrategy = require('passport-local')

passport.serializeUser((user, done) => {
  done(null, user.username)
})

passport.deserializeUser((username, done) => {
  return username == "admin" ? done(null, { username: 'admin', org: 'codelink' }) : done(new Error('Only \'admin\' user allowed!'))
})

passport.use(new LocalStrategy({}, (username, password, done) => {
  if (username == 'admin' && password == 'admin') {
    return done(null, { username: 'admin', org: 'codelink' })
  }

  return done(new Error('Only \'admin\' user allowed!'))
}))