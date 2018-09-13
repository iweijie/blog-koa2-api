const articleService = require('../service/articleService');
const userService = require('../service/userService');

module.exports = (router) => {

    router.post('/article/list', async function (ctx, next) {
        let { id, page, pageSize } = ctx.request.body;

        let { userInfo } = ctx.__wj;

        if (!id) return ctx.body = { state: 0, msg: "请传入正确的参数" }

        let result = await articleService.getArticleList(id, page, pageSize, userInfo);

        ctx.body = { state: 1, result: result }
    })
    router.post('/article/add', async function (ctx, next) {
        let { userInfo } = ctx.__wj;
        // let { userId} = userInfo || {}
        let userId = "5aeec25bc37c80c4ed526f03"
        var { title, classify, description, time, ispublic, content, autor, id } = ctx.request.body;
        if (!userId) return ctx.body = { state: 0, msg: "为嘛要玩我..." }
        if (id) {
            if (autor !== userId) return ctx.body = { state: 0, msg: "求求你住手！！" };
            var result = await articleService.setArticlDetail(id, title, classify, description, ispublic, content)
            return result ? ctx.body = { state: 1, msg: "修改成功" } : ctx.body = { state: 0, msg: "当前文章不存在" };
        }
        var result = await articleService.addArticlDetail(title, classify, description, ispublic, content, userId)
        ctx.body = { state: 1, msg: "新增文章成功" };
    })
    // 获取文章详情
    router.get('/article/get', async function (ctx, next) {

        var { id } = ctx.query;
        let { userInfo } = ctx.__wj;
        let { userId } = userInfo

        if (!id) return ctx.body = { state: 0, msg: "请传入正确的参数" };
        var result = await articleService.getArticleDetail(id, userId)

        if (!result) {
            return ctx.body = { state: 0, msg: "获取错误" }
        }
        ctx.body = { state: 1, result: result }
    })
    // 添加评论
    router.post('/article/leave/add',async function (ctx, next) {
        var { userId, name, leave, articleId, replyName, replyUserId } = ctx.request.body;
        if (!articleId) return ctx.body = { msg: "当前文章不存在", state: 0 } ;
        var params = { content: leave, createTime: Date.now() }
        if (userId) {
            let result =await userService.getUserInfoById(userId);
            if(result){
                params.name = result.name
                params.userId = userId
            }else {
                params.name = name
                params.userId = ""
            }
        } else {
            params.name = name
            params.userId = ""
        }
        if (replyName) {
            params.replyName = replyName
        }
        if (replyUserId) {
            params.replyUserId = replyUserId
        }

        let result =await articleService.addLevel(articleId,params);
        if (result) {
            return ctx.body = { msg: "成功", state: 1, result: result.leave }
        }
        return ctx.body = { msg: "保存失败", state: 0 }
    })

}
