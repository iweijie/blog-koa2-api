const request = require("request");
const config = require("../../config");
const fs = require("fs")
module.exports = (router) => {
    // 获取背景图列表
    router.get('/recommend/image/*', async function (ctx, next) {
        let result = await new Promise((resolve, reject) => {
            console.log(`${config.fileServiceUrl}${ctx.path}`)
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
        if(!Array.isArray(file)){
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
                    }catch(err){
                        return reject(err)
                    }
                    resolve(body)
                });
        })
        ctx.body = result
    })
}
