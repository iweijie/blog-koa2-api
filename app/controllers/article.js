const articleService = require('../service/articleService');

module.exports = (router)=>{

    router.post('/article/get',async function(ctx , next) {
        let { id,page,pageSize } =ctx.request.body;

        let { userInfo } = ctx.__wj;
        
        if (!id) return ctx.body={ state: 0, msg: "请传入正确的参数" }

        let result =await articleService.getArticleList(id,page,pageSize,userInfo);

        ctx.body= { state: 1, result: result }
    })
    router.post('/article/add',async function(ctx , next) {
        let { userInfo } = ctx.__wj;
        // let { userId} = userInfo || {}
        let userId = "5aeec25bc37c80c4ed526f03"
        var { title, classify, description, time, ispublic, content, autor, id } =ctx.request.body;
        if(!userId || !autor) return ctx.body = { state: 0, msg: "为嘛要玩我..." }
        if (id) {
            if (autor !== userId) return ctx.body = { state: 0, msg: "求求你住手！！" };
            var result = await articleService.setArticlDetail(id, title, classify, description, ispublic, content)
            return result ? ctx.body = { state: 1, msg: "修改成功" } : ctx.body = { state: 0, msg: "当前文章不存在" };
        }
        var result = await articleService.addArticlDetail(title, classify, description, ispublic, content, userId)
        ctx.body = { state: 1, msg: "新增文章成功" };
    })

}
