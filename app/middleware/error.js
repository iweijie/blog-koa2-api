'use strict';
const config = require("../../config/index")
// error 处理函数
module.exports = async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        err = err || new Error("Null or Undefined error");

        // !err.expose &&
            // logger.ctx(ctx).fatal(`error: ${err.message}, stack: ${err.stack}`)

        ctx.set("Cache-Control","no-cache, max-age=0");
        ctx.status = err.status || 500 ;
        ctx.type = "application/json";

        // if(err.code == 200){
        //     logger.warn(`Please do not put the error code to 200`)
        // }

        let response = err.response || {}

        ctx.body = {
            code:err.code,
            error:response.body || err.error ,
            message: err.message
        }
        if(!config.isProduction){
            ctx.body.stack = err.stack ;
        }
    } finally {
        // 上报
    }
};
