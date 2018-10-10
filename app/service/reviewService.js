
const reviewModel = require("../models/review")

const review = {
    /*
    * 依据文章ID获取文章评论列表
    * @param {String} id        文章类型
    * @return {Promise[getreview]} 承载 getreview 的 Promise 对象
    */
    getReview : (id)=>{
        return reviewModel.find({ articleId: id })
            .sort({ "createTime": 1 })
            .lean()
            .exec()
    },
    /*
    * 依据文章ID获取文章评论列表
    * @param {String} id        文章类型
    * @return {Promise[getreview]} 承载 getreview 的 Promise 对象
    */
    delReview : (id) => {
        return reviewModel.findByIdAndRemove(id)
    },
    /*
    * 添加文章评论列表
    */
    addReview : ( articleId,name, content,userId,replyName,replyUserId) => {
        var reviewInstance = new reviewModel({
            articleId,
            name,
            content,
            userId,
            replyName,
            replyUserId,
            createTime:Date.now()
        })
        return reviewInstance.save()
    },
}

module.exports = review