const userModel = require("../models/user")

const user = {
    getUserInfo:(username,password)=>{
        return userModel.findOneAndUpdate({username,password},{ $set: { LastLoginTime: Date.now() }}).exec()
    }
}

module.exports = user