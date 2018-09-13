const userModel = require("../models/user")

const user = {
    /**
    * author：weijie
    * describe：获取用户信息
    * @param {String} username 用户名
    * @param {String} password 密码
    * @return {Promise} 返回包含用户信息的Promise
    */
    userLogin: (username, password) => {
        return userModel.findOneAndUpdate(
                { username, password },
                { $set: { LastLoginTime: Date.now() } }
            )
            .exec()
    },
    /**
    * author：weijie
    * describe：获取用户信息
    * @param {String} _id 用户名ID
    * @return {Promise} 返回包含用户信息的Promise
    */
    getUserInfoById: (id) => {
        return userModel.findById(id).exec()
    }
}

module.exports = user