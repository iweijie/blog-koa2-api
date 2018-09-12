const menuService = require('../service/menuService');

module.exports = (router)=>{

    router.post('/config/menu',async function(ctx, next) {
        let {title,url,type,isPublic,_id,classify} = ctx.request.body;
        let level = 1 ;
        let resp = null
        async function save(){
            await menuService.addMenu(title,url,_id,isPublic,level,classify)
            resp = {state:1,msg:"添加成功"}
        }
        if(type == "amend") {
            let result = await menuService.setMenu(_id,title,url,isPublic,classify);
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
                }else {
                    resp = {state:0,msg:"添加失败，父级菜单ID不存在"}
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
        ctx.body = resp
    });

    router.get('/menu/list',async function(ctx, next) {
        let {userInfo} = ctx.__wj;
        let isLogin = userInfo && userInfo.isLogin || false
        let list =await menuService.getMenu(isLogin)
        ctx.body = {state:1,result:list}
    });

}
