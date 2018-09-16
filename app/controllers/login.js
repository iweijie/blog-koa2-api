const userService = require('../service/userService');
const sessionService = require('../service/sessionService');
// const {getClientIp} = require('../utils/basics');
const config = require('../../config/index');
const uuidv4 = require("uuid/v4")
const {getSessionInfo} = require("../utils/basics")


module.exports = (router)=>{

    router.post('/login/account',async function(ctx, next) {
        let { password,username,remember } = ctx.request.body;

        let result =await userService.userLogin(username, password) ;

        if(result){
            // let ip = getClientIp(ctx.request)
            
            let expires = config.expires ;
            if(!remember) {
                expires = -1 ;
            }
            let _token = uuidv4();
            let info = getSessionInfo()
            await sessionService.setSession(_token,result._id,config.expires,info)
            ctx.cookies.set(
                'token',
                _token ,
                {
                    path:'/',       // 写cookie所在的路径
                    maxAge: expires,   // cookie有效时长
                    httpOnly:true,  // 是否只用于http请求中获取
                    overwrite:true  // 是否允许重写
                }
            );
            return ctx.body = {state:1,msg:"登入成功"}
        }
        ctx.body = {state:0,msg:"账号或密码错误"}
    });
    router.post('/login/check',async function(ctx, next) {
        let userInfo = ctx.__wj.userInfo;
        ctx.body = {state:1,_id:userInfo._id,userName:userInfo.name}
    });
    
}
