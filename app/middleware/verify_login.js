'use strict';

const sessionModel = require("../models/session")

// 验证用户是否登录
module.exports = async function (ctx, next) {
	ctx.cookie.get("token")
};
