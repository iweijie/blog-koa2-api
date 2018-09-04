const Koa = require('koa')
const app = new Koa()
const bodyparser = require("koa-bodyparser")
const cors = require('koa2-cors');



const config = require("./config/index")
require('./app/models/mongoose')

app.use(cors({
	origin: function (ctx) {
		if (config.isProduction) {
			if (ctx.url.test(/^https:\/\/www\.iweijie\.cn.*$/)) {
				return "https://www.iweijie.cn"
			}
			return false;
		} else {
			return ctx.headers.origin;
		}
	},
	// exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	maxAge: 5,
	credentials: true,
	allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// app.use()

app.use(bodyparser())

app.use(async (ctx) => {
	ctx.body = {a:1,B:2};
})

app.listen(config.port)
