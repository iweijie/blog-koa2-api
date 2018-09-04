const Koa = require('koa')
const app = new Koa()
const config = require("./config/index")

require('./app/models/mongoose')

app.use( async ( ctx ) => {
    
  ctx.body = 'hello koa2'
})

app.listen(config.port)
