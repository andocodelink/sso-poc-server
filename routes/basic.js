const basicRoutes = (router) => {
    router.get('/', (ctx, next) => {
        ctx.body = 'Welcome, rugrats!';
    })
}

module.exports = basicRoutes