const tagsModel = require("../models/tags")
const articleModel = require("../models/article")
const config = require("../../config/index")

const tags = {
    /*
    * 新增标签
    * @param {String} token      
    * @return {Promise[session]} 承载 session 的 Promise 对象
    */
    addTag: ({ tagName, tagCode, description, ispublic }) => {
        let instance = new tagsModel({
            tagName,
            tagCode,
            description,
            ispublic
        })
        return instance.save()
    },

    /*
    * 修改文章数量
    * @param {String} tagCode       标签编码
    * @param {Number} num       1 增加 ； -1 减少
    * @return {Promise} Promise     
    */
    changeArticleCount: async (tagCode,num = 1) => {
        return tagsModel.updateOne({ tagCode }, { $inc: { sum: num } })
    },

    /*
    * 获取标签信息
    * @param {String} tagCode       标签编码
    * @return {Promise} Promise     
    */
    getTagsInfo: (tagCode) => {
        return tagsModel.findOne({ tagCode })
    },
    /*
    * 获取标签信息列表
    * @return {Promise} Promise     
    */
    getTagsInfoList: (userId) => {
        let query;
        if (userId) {
            query = {
                "$or": [
                    { ispublic: 0 },
                    { ispublic: 1 },
                    { creator: userId }
                ]
            }
        } else {
            query = { ispublic: 0 }
        }
        return tagsModel.find(query)
    }
}

module.exports = tags