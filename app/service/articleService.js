const articleModel = require("../models/article")
const reviewService = require("./reviewService")
const { myError } = require("../utils/basics")

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
    setArticlDetail: (id, tags, title, classify, description, ispublic, content) => {
        if (!id || !tags || !title || !classify || !description || ispublic === undefined || !content) {
            myError("修改文章错误")
        }
        var nowtime = Date.now()
        return articleModel.findOneAndUpdate({ _id: id }, { $set: { title, tags, classify, description, ispublic, content, updateTime: nowtime } }).exec();
    },
    /*
    * 新增文章详情
    */
    addArticlDetail: (params) => {
        let { title, tags, classify, description, ispublic, content, autor } = params;
        if (!title || !classify || !tags || !description || !ispublic || !content || !autor) {
            myError("新增文章错误")
        }
        var nowtime = Date.now()
        var articleInstance = new articleModel({
            title,
            tags,
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
    getArticleDetail: async (_id, userId, field = "title tags description classify time ispublic content createTime updateTime autor") => {
        if (!_id) {
            myError("ID 为必传字段")
        }
        let article = articleModel.findById(
            _id,
            field
        )
            .populate({
                path: "autor",
                select: "name"
            })
            .lean()
            .exec()
        let review = reviewService.getReview(_id)

        let result = await Promise.all([article, review])
            .then(result => {
                if (!result[0]) {
                    myError("文章不存在", 2)
                }
                let articleDetail = result[0]
                articleDetail.review = result[1] || []
                return articleDetail
            })

        if (result && (result.ispublic || (userId && userId === result.autor._id.toString()))) return result;
        myError("文章不存在", 2)
    },
    /*
    * 依据条件获取文章总数量
    * @param {Object} type   文章类型
    * @return {Promise[ArticleDetail]} 承载 ArticleDetail 的 Promise 对象
    */
    getArticleListCount: (type) => {
        if (type) return articleModel.countDocuments()
        return articleModel.countDocuments({ classify: type })
    }
}


module.exports = article