const userModel = require("../models/user")

const user = {
    /**
    * author：weijie
    * describe： 
    * @param {String} username 用户名
    * @param {String} password 密码
    * @return {Promise} 返回包含用户信息的Promise
    */
    getUserInfo:(username,password)=>{
        return  userModel.findOneAndUpdate(
                    {username,password},
                    { $set: { LastLoginTime: Date.now() }}
                )
                .exec()
    }
}

module.exports = user