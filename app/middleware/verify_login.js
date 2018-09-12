'use strict';

const sessionModel = require("../models/session")
const {aesDecrypt} = require("../utils/crypto")
// 获取用户信息
module.exports = async function (ctx, next) {
	var token = ctx.cookies.get("token");
	ctx.__wj = {
		userInfo:{}
	}
	if(token){
		var id = aesDecrypt(token);
		var result = await sessionModel.getSession(id);
		if(result){
			ctx.__wj.userInfo = {
				...result,
				isLogin:true
			}
		}
	}
	await next()
};
