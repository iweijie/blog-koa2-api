// const logger
const { access } = require('../utils/log4js');
// error 处理函数
module.exports = async function (ctx, next) {
    let time = Date.now();
    await next();
    access.info(`pid: ${ctx.cookies.get('pid')}, renderTime: ${Date.now() - time}, status: ${ctx.status}, url: ${ctx.url}`)
};
