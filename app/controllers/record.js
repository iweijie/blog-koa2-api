const recordSevice = require('../service/recordSevice');



module.exports = (router) => {
    // 添加
    router.post('/record/add', async function (ctx, next) {
        let { id, category, tag, value, list } = ctx.request.body;
        let { userId } = ctx.__wj.userInfo;
        if (!userId) return ctx.body = { msg: "修改失败，请登入后再 新增/修改", state: 0 };
        if (id) {
            // if (!tagName || !tagCode || ispublic === undefined || userId != creator || !userId) return ctx.body = { msg: "参数错误", state: 0 };
            // if (!description) description = "";
            // await tagsService.setArticle(id, { tagName, tagCode, description, ispublic });
            ctx.body = { msg: "修改成功", state: 1 }
        } else {
            if (!list.length) return ctx.body = { msg: "参数不能为空", state: 0 }
            for (let i = 0; i < list.length; i++) {
                const { category, tag, value, time } = list[i]
                await recordSevice.addRecord({ category, tag, time, value, creator: userId });
            }
            ctx.body = { msg: "添加成功", state: 1 }
        }
    })

    // 获取列表
    router.post('/record/list', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        if (!userId) return ctx.body = { msg: "获取列表失败", state: 0 };
        const { category, tag, time } = ctx.request.body;
        let result = await recordSevice.getRecordList({ creator: userId, category, tag, time })
        ctx.body = { msg: "获取成功", state: 1, result }
    })
    // add 分类
    router.post('/record/category/add', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        const { name, type, hasTag, tags, unit, creator } = ctx.request.body;
        let result = await recordSevice.addRecordCategory({ creator: userId, name, type, hasTag, tags, unit })
        ctx.body = { msg: "新增成功", state: 1 }
    })

    // get 分类列表
    router.post('/record/category/list', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        let result = await recordSevice.getRecordCategoryList(userId)
        ctx.body = { msg: "获取成功", state: 1, result }
    })
}
