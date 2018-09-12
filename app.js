const Koa = require('koa')
const Router = require('koa-router');
const koabody = require("koa-body")
const cors = require('koa2-cors');
const config = require("./config/index")
const verifyLogin = require("./app/middleware/verify_login")
const error = require("./app/middleware/error")
const router = require("./app/middleware/router")
require('./app/models/index')

const app = new Koa()
// 错误处理
app.use(error)
// 跨域处理
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
// 参数解析
app.use(koabody({ multipart: true}))

// 验证是否登入
app.use(verifyLogin)
// 引入路由
router(app)

app.use(async (ctx) => {
	ctx.body = {a:1,B:2};
})

app.listen(config.port)
