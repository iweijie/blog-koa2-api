const request = require("request");
const config = require("../../config");
const fs = require("fs")
module.exports = (router) => {
    // 获取背景图列表
    router.get('/recommend/image/*', async function (ctx, next) {
        let result = await new Promise((resolve, reject) => {
            request.get(`${config.fileServiceUrl}${ctx.path}`, (err, response, body) => {
                if (err) return reject(err)

                try { body = JSON.parse(body) }
                catch (error) { return reject(error) }

                resolve(body)
            })
        })
        ctx.body = result
    })

    // 文件转存
    router.post('/fileupload', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        if (!userId) return { msg: "参数错误", state: 0 }
        let { file } = ctx.request.files;
        let { body } = ctx.request;

        var formData = {};
        for (let k in body) {
            formData[k] = body[k]
        }
        formData.file = [];
        if (!Array.isArray(file)) {
            file = [file]
        }
        file.forEach(v => {
            formData.file.push({
                value: fs.createReadStream(v.path),
                options: {
                    filename: v.name,
                    contentType: v.type
                }
            })
        })
        let result = await new Promise((resolve, reject) => {
            request.post(
                {
                    url: `${config.fileServiceUrl}${ctx.path}`,
                    formData: formData
                },
                function optionalCallback(err, httpResponse, body) {
                    if (err) {
                        return reject(err)
                    }
                    try {
                        body = JSON.parse(body)
                    } catch (err) {
                        return reject(err)
                    }
                    resolve(body)
                });
        })
        ctx.body = result
    })
    // 获取上传文件列表
    router.get('/file/list', async function (ctx, next) {
        let { userInfo } = ctx.__wj;
        let { page, pageSize, type } = ctx.query;
        if(!type || !page || !pageSize) return ctx.body = {state:0,msg:"参数错误"} 
        let filePath;
        if (userInfo.isLogin) {
            filePath = /\?/.test(ctx.url) ?
                `${config.fileServiceUrl}${ctx.url}&userId=${userInfo.userId}`
                :
                `${config.fileServiceUrl}${ctx.url}?userId=${userInfo.userId}`
        } else {
            filePath = `${config.fileServiceUrl}${ctx.url}`
        }
        let result = await new Promise((resolve, reject) => {
            request.get(filePath, (err, response, body) => {
                if (err) return reject(err)
                try { body = JSON.parse(body) }
                catch (error) { return reject(error) }

                resolve(body)
            })
        })
        ctx.body = result
    })
}
