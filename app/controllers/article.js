const articleService = require('../service/articleService');
const tagsService = require('../service/tagsService');
const reviewService = require('../service/reviewService');
const { stringToEntity } = require("../utils/basics")

module.exports = (router) => {
    // router.get('/article/update', async function (ctx, next) {
    //     await articleService.updateArticleList()
    //     ctx.body = { state: 1, msg:"更新成功" }
    // })
    router.get('/article/list', async function (ctx, next) {
        let { tag, page, pageSize } = ctx.query;
        page = Number(page) || 1
        pageSize = Number(pageSize) || 10
        let { userId } = ctx.__wj.userInfo;
        if (tag) {
            let tagInfo = await tagsService.getTagsInfo(tag);
            let ispublic = tagInfo.ispublic;

            if ((ispublic === 1 && !userId) || (ispublic === 2 && tagInfo.creator.toString() !== userId)) {
                return ctx.body = { state: 0, msg: "你在做什么？？" }
            }
        }
        let result = await articleService.getArticleList({ tag, page, pageSize, userId })

        ctx.body = { state: 1, result: result[0], total: result[1] }
    })
    router.post('/article/add', async function (ctx, next) {
        let { userInfo } = ctx.__wj;
        let { userId } = userInfo || {}
        let { title, description, tags, ispublic, content, autor, id } = ctx.request.body;
        if (!userId) return ctx.body = { state: 0, msg: "为嘛要玩我!!" }
        if (id) {
            if (autor !== userId) return ctx.body = { state: 0, msg: "求求你住手!!" };
            await articleService.setArticlDetail({ id, tags, title, description, ispublic, content });
            return ctx.body = { state: 1, msg: "修改成功" }
        }
        await articleService.addArticlDetail({ title, tags, description, ispublic, content, autor });
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
    router.post('/article/review/add', async function (ctx, next) {
        var { userId, name, leave, articleId, replyName, replyUserId } = ctx.request.body;
        if (!articleId) return ctx.body = { msg: "当前文章不存在", state: 0 };
        if (!name) return ctx.body = { msg: "评论人名称不能为空", state: 0 };
        leave = stringToEntity(leave)
        let result = await reviewService.addReview(articleId, name, leave, userId, replyName, replyUserId);

        if (result) {
            return ctx.body = { msg: "成功", state: 1, result: result }
        }
        return ctx.body = { msg: "保存失败", state: 0 }
    })
    // 删除评论
    router.post('/article/review/del', async function (ctx, next) {
        var { id } = ctx.request.body;
        if (id) return ctx.body = { msg: "ID 不能为空", state: 0 }
        let result = await reviewService.delReview(id);

        if (result) {
            return ctx.body = { msg: "删除成功", state: 1, result: result.review }
        }
        return ctx.body = { msg: "删除失败", state: 0 }
    })

    // 推荐文章
    router.post('/article/recommend', async function (ctx, next) {
        let result = await articleService.getRecommendList();
        return ctx.body = { msg: "获取成功",state: 1, result: result  }
    })

}
