const articleModel = require("../models/article")

const article = {
    /*
    * 依据文章类型获取文章列表
    * @param {String} id        文章类型
    * @param {String} page      页数
    * @param {String} pageSize  每页记录条数
    * @param {Object} userInfo  用户信息，有值代表有登入
    * @return {Promise[ArticleList]} 承载 ArticleList 的 Promise 对象
    */
    getArticleList : (id,page,pageSize,userInfo)=>{
        if(userInfo){
            return  articleModel.find(
                        { "$or": [{ classify: id, ispublic: true }, { classify: id, autor: userInfo.userId }] },
                        "title description classify createTime autor time", 
                        { skip: (page - 1) * pageSize, limit: pageSize }
                    )
                    .populate({
                        path: "autor",
                        select: "name"
                    })
                    .sort({ "createTime": -1 })
                    .exec()

        }else {
            return  articleModel.find(
                        { classify: id, ispublic: true },
                        "title description classify createTime autor time", 
                        { skip: (page - 1) * pageSize, limit: pageSize }
                    )
                    .populate({
                        path: "autor",
                        select: "name"
                    })
                    .sort({ "createTime": -1 })
                    .exec()
        }
    },
    /*
    * 依据文章ID获取文章详情
    * @param {String} _id       文章ID
    * @param {Object} userInfo  用户信息，有值代表有登入
    * @return {Promise[ArticleDetail]} 承载 ArticleDetail 的 Promise 对象
    */
    getArticleDetail :async (_id,userInfo)=>{
        let result = await articleModel.findOne(
                        { _id: id },
                        "title description classify time ispublic content createTime updateTime autor leave"
                    )
                    .populate({
                        path: "autor",
                        select: "name"
                    })
                    .exec()
        if (result && (result.ispublic || (userInfo && userInfo.userId === result.autor.id))) return result;
        
        throw new Error("文章获取错误")
    }
}


module.exports = article