
const leaveModel = require("../models/leave")

const leave = {
    /*
    * 依据文章ID获取文章评论列表
    * @param {String} id        文章类型
    * @return {Promise[getLeave]} 承载 getLeave 的 Promise 对象
    */
    getLeave : (id)=>{
        return leaveModel.find({ articleId: id })
            .sort({ "createTime": 1 })
            .lean()
            .exec()
    },
    /*
    * 依据文章ID获取文章评论列表
    * @param {String} id        文章类型
    * @return {Promise[getLeave]} 承载 getLeave 的 Promise 对象
    */
    delLeave : (id) => {
        return leaveModel.findByIdAndRemove(id)
    },
    /*
    * 添加文章评论列表
    */
    addLeave : ( articleId,name, content,userId,replyName,replyUserId) => {
        var leaveInstance = new leaveModel({
            articleId,
            name,
            content,
            userId,
            replyName,
            replyUserId,
        })
        return leaveInstance.save()
    },
}

module.exports = leave