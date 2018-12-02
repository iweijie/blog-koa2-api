// const logger
const config = require("../../config/index")
const log = require('../utils/log4js').err;
// error 处理函数
module.exports = async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.set("Cache-Control", "no-cache, max-age=0");

        if (err.__wj) {
            log.error(`pid: ${ctx.cookies.get('pid')}, message: ${err.message}, stack: ${err.stack}`)
            ctx.status = 200;
            ctx.body = {
                state: err.state,
                msg: err.msg
            }
        } else {
            log.error(`message: ${err.message}, stack: ${err.stack}`)
            ctx.status = err.status || 500;
            ctx.body = {
                state: err.code || 0,
                msg: err.message
            }
        }
        if (!config.isProduction) {
            ctx.body.stack = err.stack;
        }
    } finally {

    }
};
