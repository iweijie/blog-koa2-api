const articleService = require('../service/articleService');
const tagsService = require('../service/tagsService');
const reviewService = require('../service/reviewService');
const {diff} = require("../utils/basics")

module.exports = (router) => {

    router.get('/article/list', async function (ctx, next) {
        let { id, page, pageSize } = ctx.query;
        page = Number(page) || 1
        pageSize = Number(pageSize) || 10
        let { userId } = ctx.__wj.userInfo;

        if (!id) return ctx.body = { state: 0, msg: "请传入正确的参数" }

        let result = await Promise.all([
            articleService.getArticleList(id, page, pageSize, userId),
            articleService.getArticleListCount(id)
        ]);

        ctx.body = { state: 1, result: result[0], total: result[1] }
    })
    router.post('/article/add', async function (ctx, next) {
        let { userInfo } = ctx.__wj;
        let { userId } = userInfo || {}
        var { title, classify, description, tags,ispublic, content, autor, id } = ctx.request.body;
        if (!userId) return ctx.body = { state: 0, msg: "为嘛要玩我..." }
        if (id) {
            if (autor !== userId) return ctx.body = { state: 0, msg: "求求你住手！！" };
            let oldTags = await articleService.getArticleDetail(id,userId,"tags")
            await articleService.setArticlDetail(id,tags, title, classify, description, ispublic, content);
            let {add,remove} = diff(tags,oldTags);
            await Promise.all([
                ...add.map(v=>{
                    return tagsService.addArticleId(v,id)
                }),
                ...remove.map(v=>{
                    return tagsService.removeArticleId(v,id)
                })
            ])
            return ctx.body = { state: 1, msg: "修改成功" }
        }
        var result = await articleService.addArticlDetail(title, classify,tags, description, ispublic, content, userId)
        await Promise.all(tags.map(v=>{
            return tagsService.addArticleId(v,result._id)
        }))
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
    // 添加标签
    router.post('/article/addtag', async function (ctx, next) {
        var { tagName,tagCode,description,ispublic} = ctx.request.body;
        if (!tagName || !tagCode || ispublic === undefined ) return ctx.body = { msg: "参数错误", state: 0 }
        if(!description) description = "";
        await tagsService.addTag({tagName,tagCode,description,ispublic});
        ctx.body = { msg: "添加成功", state: 1 }
    })
    
}
