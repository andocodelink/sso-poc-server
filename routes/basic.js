const passport = require('passport')

module.exports = (router) => {
  router.get('/', async (ctx, next) => {
    ctx.body = 'Welcome, rugrats!';
  })

  router.get('/login', async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.body = { status: 'Logged in as user ' + ctx.req.user.username + ' of ' + ctx.req.user.org }
    } else {
      ctx.throw(401)
    }
  })

  router.post('/login', async (ctx) => {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        const res = ctx.login(user)
        ctx.body =  { success: true }
      } else {
        ctx.throw(400, JSON.stringify({ status: 'Error' }))
      }
    })(ctx)
  })

  router.get('/logout', async (ctx) => {
    if (ctx.isAuthenticated()) {
      const res = ctx.logout()
      ctx.body = { success: true }
    } else {
      ctx.throw(401)
    }
  })
}