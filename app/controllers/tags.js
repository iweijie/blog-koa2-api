const articleService = require('../service/articleService');
const tagsService = require('../service/tagsService');

module.exports = (router) => {
    // 添加标签
    router.post('/tags/add', async function (ctx, next) {
        let { tagName, tagCode, description, ispublic } = ctx.request.body;
        let { userId } = ctx.__wj.userInfo;
        if (!tagName || !tagCode || ispublic === undefined || !userId) return ctx.body = { msg: "参数错误", state: 0 }
        if (!description) description = "";
        await tagsService.addTag({ tagName, tagCode, description, ispublic, creator: userId });
        ctx.body = { msg: "添加成功", state: 1 }
    })

    // 获取标签列表
    router.post('/tags/list', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        let result = await articleService.getTagsArticleCount(userId)
        ctx.body = { msg: "获取成功", state: 1 ,result}
    })
}
