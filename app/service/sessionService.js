const sessionModel = require("../models/session")

const session = {
    /*
    * 获取存储的 session
    * @param {String} token      
    * @return {Promise[session]} 承载 session 的 Promise 对象
    */
    getSession:(token)=>{
        return sessionModel.findOne({"_token":token}).exec()
    },
    
    /*
    * 存储 session
    * @param {String} uid       随机ID
    * @param {String} userId    用户ID 
    * @param {String} expires   时长  
    * @param {String} info      信息
    * @return {Promise[session]} 承载 session 的 Promise 对象
    */
    setSession:(uid,userId,expires,info)=>{
        let sessionInfo =  new sessionModel({
            userId,
            expires,
            info,
            _token:uid
        })
        return sessionInfo.save()
    },
    
    /*
    * 更新 session 时长
    * @param {String} token       token
    * @return {Promise[session]} 承载 session 的 Promise 对象
    */
    refresh:(token)=>{
        return sessionModel.findOneAndUpdate({"_token":token},{expires: Date.now() + 3*24*60*60*1000}).exec()
    }
}

module.exports = session