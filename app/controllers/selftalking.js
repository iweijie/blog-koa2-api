// 碎碎念
const selftalkingService = require('../service/selftalkingService');

module.exports = (router) => {
    // 添加记录
    router.post('/selftalking/add', async function (ctx, next) {
        let { content} = ctx.request.body;
        let { userId } = ctx.__wj.userInfo;
        if (!content || !userId) return ctx.body = { msg: "参数错误", state: 0 };
        await selftalkingService.addSelftalking({ content, creator: userId });
        ctx.body = { msg: "添加成功", state: 1 }
    })

    // 获取记录列表
    router.post('/selftalking/list', async function (ctx, next) {
        let { page , pageSize} = ctx.request.body;
        let result =await Promise.all([
            selftalkingService.getSelftalkingList(page,pageSize),
            selftalkingService.getSelftalkingListCount()
        ])
        let list = result[0].map(v=>{
            v.creator = v.creator.name
            return v
        })
        ctx.body = { msg: "获取成功", state: 1 ,result:list,count:result[1]}
    })
}
