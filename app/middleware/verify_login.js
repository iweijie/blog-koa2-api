'use strict';

const sessionModel = require("../models/session")
const {aesDecrypt} = require("../utils/crypto")
// 获取用户信息
module.exports = async function (ctx, next) {
	var token = ctx.cookies.get("token");
	ctx.__wj = {
		userInfo:{
			isLogin : false 
		}
	}
	// if(token){
	// 	var id = aesDecrypt(token);
	// 	var result = await sessionModel.getSession(id);
	// 	if(result){
	// 		ctx.__wj.userInfo = {
	// 			...result,
	// 			isLogin:true
	// 		}
	// 	}
	// }
	await next()
};

// ctx.cookies.set(
// 	'cid','hello world',{
// 		domain:'localhost', // 写cookie所在的域名
// 		path:'/',       // 写cookie所在的路径
// 		maxAge: 2*60*60*1000,   // cookie有效时长
// 		expires:new Date('2018-02-08'), // cookie失效时间
// 		httpOnly:false,  // 是否只用于http请求中获取
// 		overwrite:false  // 是否允许重写
// 	}
// );