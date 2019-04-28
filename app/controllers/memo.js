const memoSevice = require('../service/memoSevice');



module.exports = (router) => {
    // 添加
    router.post('/memo/add', async function (ctx, next) {
        let { id, title, category, tag, type, value } = ctx.request.body;
        let { userId } = ctx.__wj.userInfo;
        if (!userId) return ctx.body = { msg: "修改失败，请登入后再 新增/修改", state: 2 };
        if (id) {
            // if (!tagName || !tagCode || ispublic === undefined || userId != creator || !userId) return ctx.body = { msg: "参数错误", state: 0 };
            // if (!description) description = "";
            // await tagsService.setArticle(id, { tagName, tagCode, description, ispublic });
            ctx.body = { msg: "修改成功", state: 1 }
        } else {
            await memoSevice.addTag({ title, category, tag, type, value, creator: userId });
            ctx.body = { msg: "添加成功", state: 1 }
        }
    })

    // 获取列表
    router.post('/memo/list', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        if (!userId) return ctx.body = { msg: "获取列表失败", state: 2 };
        const { category, tag, time } = ctx.request.body;
        let result = await memoSevice.getMemoList({ creator: userId, category, tag, time })
        ctx.body = { msg: "获取成功", state: 1, result }
    })
    // add 分类
    router.post('/memo/category/add', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        const { name, type, hasTag, tags, unit, creator } = ctx.request.body;
        let result = await memoSevice.addMemoCategory({ creator: userId, name, type, hasTag, tags, unit })
        ctx.body = { msg: "获取成功", state: 1, result }
    })

    // get 分类列表
    router.post('/memo/category/list', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        let result = await memoSevice.getMemoCategoryList(userId)
        ctx.body = { msg: "获取成功", state: 1, result }
    })
}
