const Koa = require('koa')
const koabody = require("koa-body")
// const session = require("koa-session")
const cors = require('koa2-cors');
const config = require("./config/index")
// const sessionConfig = require("./app/utils/sessionConfig")

const verifyLogin = require("./app/middleware/verify_login")
const error = require("./app/middleware/error")
const router = require("./app/middleware/router")
const accesslog = require("./app/middleware/accesslog")

const etag = require('koa-etag')();
const log = require('./app/utils/log4js').err;


require('./app/models/index')

const app = new Koa()
// 错误处理
app.use(error)
// app.use(session(sessionConfig, app))
// 访问日志
app.use(accesslog)

// 跨域处理
app.use(cors({
	origin: function (ctx) {
		console.log("config.isProduction", config.isProduction)
		if (config.isProduction) {
			console.log("ctx.href", ctx.href)
			console.log("ctx.href", /^https?:\/\/blogapi\.iweijie\.cn.*$/.test(ctx.href))
			if (/^https?:\/\/blogapi\.iweijie\.cn.*$/.test(ctx.href)) {
				console.log("ctx.headers.origin", ctx.headers.origin)
				return ctx.headers.origin;
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
// 参数解析
app.use(koabody({ multipart: true }))

// 验证是否登入
app.use(verifyLogin)

app.use(etag)
// 引入路由
router(app)

app.use(async (ctx) => {
	ctx.body = { state: 2, msg: "Not Found" };
})

app.listen(config.port)

process.on('unhandledRejection', (err) => {
	log.error(`pid: ${ctx.cookies.get('pid')}, message: ${err.message}, stack: ${err.stack}`)
});

process.on('uncaughtException', (err) => {
	log.error(`pid: ${ctx.cookies.get('pid')}, message: ${err.message}, stack: ${err.stack}`)
});