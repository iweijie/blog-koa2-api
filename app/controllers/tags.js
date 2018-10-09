const articleService = require('../service/articleService');
const tagsService = require('../service/tagsService');

module.exports = (router) => {
    // 添加标签
    router.post('/tags/add', async function (ctx, next) {
        let { tagName, tagCode, description, ispublic,id,creator } = ctx.request.body;
        let { userId } = ctx.__wj.userInfo;
        if(id){
            if (!tagName || !tagCode || ispublic === undefined || userId != creator || !userId) return ctx.body = { msg: "参数错误", state: 0 };
            if (!description) description = "";
            await tagsService.setArticle(id,{tagName,tagCode,description,ispublic});
            ctx.body = { msg: "修改成功", state: 1 }
        }else {
            if (!tagName || !tagCode || ispublic === undefined || !userId) return ctx.body = { msg: "参数错误", state: 0 }
            if (!description) description = "";
            let isExist = await tagsService.getTagsInfo(tagCode);
            if(isExist) return ctx.body = { msg: "当前编码已存在", state: 0 }
            await tagsService.addTag({ tagName, tagCode, description, ispublic, creator: userId });
            ctx.body = { msg: "添加成功", state: 1 }
        }
    })

    // 获取标签列表
    router.post('/tags/list', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        let result = await articleService.getTagsArticleCount(userId)
        ctx.body = { msg: "获取成功", state: 1 ,result}
    })
    // 获取标签列表(详细信息)
    router.post('/tags/detailList/', async function (ctx, next) {
        let { userId } = ctx.__wj.userInfo;
        let result = await tagsService.getTagsInfoList(userId)
        result = result.map(v=>{
            v.creatorId = v.creator._id
            v.creator = v.creator.name
            return v
        })
        ctx.body = { msg: "获取成功", state: 1 ,result}
    })
}
