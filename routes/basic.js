const passport = require('passport')
const chalk = require('chalk')

module.exports = (router) => {
  router.get('/', async (ctx, next) => {
    console.log('cookie SESSIONID=' + chalk.yellow(ctx.cookies.get('SESSIONID')))
    ctx.body = ctx.isAuthenticated() ? 'Hello, ' + ctx.req.user.username + '!' : 'Hello, rugrats!' ;
  })

  router.get('/login', async (ctx) => {
    console.log('cookie SESSIONID=' + chalk.yellow(ctx.cookies.get('SESSIONID')))
    if (ctx.isAuthenticated()) {
      ctx.body = { 
        access_token: 'sso_access_token',
        refresh_token: 'sso_refresh_token'
      }
    } else {
      ctx.throw(401)
    }
  })

  router.post('/login', async (ctx) => {
    console.log('cookie SESSIONID=' + chalk.yellow(ctx.cookies.get('SESSIONID')))
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        const res = ctx.login(user)
        ctx.body = { 
          access_token: 'sso_access_token',
          refresh_token: 'sso_refresh_token'
        }
      } else {
        ctx.throw(400, JSON.stringify({ status: 'Error' }))
      }
    })(ctx)
  })

  router.get('/logout', async (ctx) => {
    console.log('cookie SESSIONID=' + chalk.yellow(ctx.cookies.get('SESSIONID')))
    if (ctx.isAuthenticated()) {
      ctx.logout()
      ctx.body = { success: true }
    } else {
      ctx.throw(401)
    }
  })
}