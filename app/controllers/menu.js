const menuService = require('../service/menuService');

module.exports = (router)=>{

    router.post('/api/config/menu',async function(ctx, next) {
        let {title,url,type,isPublic,_id,classify} = ctx.request.body;
        let level = 1 ;
        let resp = null
        async function save(){
            await menuService.addMenu(title,url,_id,isPublic,level,classify)
            resp = {state:1,msg:"添加成功"}
        }
        if(type == "amend") {
            let result = await menuService.setMenu(title,url,isPublic,classify,manner);
            if(!result){
                resp =  {state:0,msg:"当前配置不存在"}
            }else {
                resp = {state:1,msg:"修改成功"}
            }
        }else if(type == "add"){
            if(!_id){
                await save()
            }else {
                let result = await menuService.findMenu(_id);
                if(result){
                    level += result.level;
                    await save()
                }
            }
        }else if(type == "remove"){
            if(!_id){
                resp = {state:0,msg:"ID 为必传字段"}
            }
            let result = await menuService.removeMenu()
            if(result){
                resp = {state:1,msg:"删除成功"}
            }
        } else {
            resp = {state:0,msg:"修改失败"}
        }
        cxt.body = resp
    });

    router.get('/api/menu/list',async function(ctx, next) {
        let {isLogin} = ctx.__wj.userInfo
        let list =await menuService.getMenu(isLogin)
        cxt.body = {state:1,result:list}
    });

}
