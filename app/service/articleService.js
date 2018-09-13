const articleModel = require("../models/article")

const article = {
    /*
    * 依据文章类型获取文章列表
    * @param {String} id        文章类型
    * @param {String} page      页数
    * @param {String} pageSize  每页记录条数
    * @param {Object} userId    用户id，有值代表有登入
    * @return {Promise[ArticleList]} 承载 ArticleList 的 Promise 对象
    */
    getArticleList: (id, page, pageSize, userId) => {
        if (userId) {
            return articleModel.find(
                { "$or": [{ classify: id, ispublic: true }, { classify: id, autor: userId }] },
                "title description classify createTime autor time",
                { skip: (page - 1) * pageSize, limit: pageSize }
            )
                .populate({
                    path: "autor",
                    select: "name"
                })
                .sort({ "createTime": -1 })
                .exec()

        } else {
            return articleModel.find(
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
    * 修改文章详情
    */
    setArticlDetail: (id, title, classify, description, ispublic, content) => {
        var nowtime = Date.now()
        return articleModel.findOneAndUpdate({ _id: id }, { $set: { title, classify, description, ispublic, content, updateTime: nowtime } }).exec();
    },
    /*
    * 新增文章详情
    */
    addArticlDetail: (title, classify, description, ispublic, content, autor) => {
        var nowtime = Date.now()
        var articleInstance = new articleModel({
            title,
            classify,
            description,
            time: 0,
            ispublic,
            content,
            autor,
            createTime: nowtime,
            updateTime: nowtime,
        })
        return articleInstance.save()
    },
    /*
    * 依据文章ID获取文章详情
    * @param {String} _id       文章ID
    * @param {Object} userId    用户ID，有值代表有登入
    * @return {Promise[ArticleDetail]} 承载 ArticleDetail 的 Promise 对象
    */
    getArticleDetail: async (_id, userId) => {
        let result = await articleModel.findById(
            _id,
            "title description classify time ispublic content createTime updateTime autor leave"
        )
            .populate({
                path: "autor",
                select: "name"
            })
            .exec()
        if (result && (result.ispublic || (userId === result.autor.id))) return result;
    },

    /*
    * 新增文章评论
    * @param {String} _id       文章ID
    * @param {Object} params    添加评论参数
    */
    addLevel: async (_id, params) => {
        return articleModel.findByIdAndUpdate(_id, { $push: { leave: params } }, { new: true })
    }
}


module.exports = article