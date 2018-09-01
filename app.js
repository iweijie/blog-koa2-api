const Koa = require('koa')
const app = new Koa()
const config = require("./config/index")

app.use( async ( ctx ) => {
    
  ctx.body = 'hello koa2'
})

app.listen(config.port)

console.log('[demo] start-quick is starting at port 3000')