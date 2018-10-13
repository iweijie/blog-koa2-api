'use strict';
const sessionService = require("../service/sessionService")
const userService = require("../service/userService")
const {getSessionInfo} = require("../utils/basics")
// const {aesDecrypt} = require("../utils/crypto")
// 获取用户信息
module.exports = async function (ctx, next) {
	var token = ctx.cookies.get("token");
	console.log("token",token)
	ctx.__wj = {
		userInfo:{
			isLogin : false 
		}
	}
	if(token){

		var result = await sessionService.getSession(token);
		
		console.log("result",result)
		if(result){
			// if(getSessionInfo() !== result.info){
			// 	ctx.cookies.set(
			// 		'token',
			// 		"" ,
			// 		{
			// 			path:'/',       // 写cookie所在的路径
			// 			maxAge: 0,   // cookie有效时长
			// 			httpOnly:true,  // 是否只用于http请求中获取
			// 			overwrite:true  // 是否允许重写
			// 		}
			// 	);
			// }else {
				var userInfo = await userService.getUserInfoById(result.userId);
				
				console.log("verify_login_userInfo",userInfo)
				ctx.__wj.userInfo = {
					...userInfo,
					userId:userInfo._id.toString(),
					isLogin:true
				}
			// }

		}
		
	}
	await next()
};