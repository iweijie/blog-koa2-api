const tagsModel = require("../models/tags")
const config = require("../../config/index")

const tags = {
    /*
    * 新增标签
    * @param {String} token      
    * @return {Promise[session]} 承载 session 的 Promise 对象
    */
    addTag: ({ tagName,tagCode, description, ispublic }) => {
        let instance = new tagsModel({
            tagName,
            tagCode,
            description,
            ispublic
        })
        return instance.save()
    },

    /*
    * 新增文章ID
    * @param {String} tagCode       标签编码
    * @param {String} articleId     文章ID 
    * @return {Promise} Promise     
    */
    addArticleId: (tagCode, articleId) => {
        return tagsModel.findOneAndUpdate({ tagCode }, { $push: { articleIdList: articleId }, $inc: { sum: 1 } })
    },
    /*
    * 移除文章ID
    * @param {String} tagCode       标签编码
    * @param {String} articleId     文章ID 
    * @return {Promise} Promise     
    */
    removeArticleId: (tagCode, articleId) => {
        return tagsModel.findOneAndUpdate({ tagCode }, { $pull: { articleIdList: articleId }, $inc: { sum: -1 } })
    },
}

module.exports = tags