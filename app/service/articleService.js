const articleModel = require("../models/article")
const reviewService = require("./reviewService")
const tagsService = require("./tagsService")
const { myError } = require("../utils/basics")

const article = {
    /*
    * 依据文章标签获取文章列表 及 总数量 ( 当前只区分 登入与否 和 有无tag ；其他没有做区分)
    * @param {String} id        文章类型
    * @param {String} page      页数
    * @param {String} pageSize  每页记录条数
    * @param {Object} userId    用户id，有值代表有登入
    * @return {Promise[ArticleList]} 承载 ArticleList 的 Promise 对象
    */
    getArticleList: ({
        tag, page, pageSize, userId
    }) => {
        let query;
        if (userId) {
            if (tag) {
                query = {
                    "$or": [
                        { tags: { "$in": [tag] }, ispublic: 0 },
                        { tags: { "$in": [tag] }, ispublic: 1 },
                        { tags: { "$in": [tag] }, ispublic: 2, autor: userId }
                    ]
                }
            } else {
                query = { "$or": [{ ispublic: 0 }, { ispublic: 1 }, { autor: userId }] }
            }
        } else {
            if (tag) {
                query = { tags: { "$in": [tag] }, ispublic: 0 }
            } else {
                query = { ispublic: 0 }
            }
        }

        return Promise.all([
            articleModel.find(
                query,
                "title description createTime tags autor time",
                { skip: (page - 1) * pageSize, limit: pageSize }
            )
                .populate({
                    path: "autor",
                    select: "name"
                })
                .sort({ "createTime": -1 })
                .exec(),
            articleModel.countDocuments(query)
        ])
    },
    /*
    * 修改文章详情
    */
    setArticlDetail: (params) => {
        let { id, tags, title, description, ispublic, content } = params;
        if (!id || !tags || !title || !description || ispublic === undefined || !content) {
            myError("修改文章错误")
        }
        var nowtime = Date.now()
        return articleModel.findOneAndUpdate({ _id: id }, { $set: { title, tags, description, ispublic, content, updateTime: nowtime } }).exec();
    },
    /*
    * 新增文章详情
    */
    addArticlDetail: (params) => {
        let { title, tags, description, ispublic, content, autor } = params;
        if (!title || !tags || !description || ispublic === undefined || !content || !autor) {
            myError("新增文章错误")
        }
        var nowtime = Date.now()
        var articleInstance = new articleModel({
            title,
            tags,
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
    getArticleDetail: async (_id, userId, field = "title description tags time ispublic content createTime updateTime autor") => {
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

        if (result && (result.ispublic === 0 || (userId && result.ispublic === 1) || (userId && userId === result.autor._id.toString()))) return result;
        myError("文章不存在", 2)
    },
    /*
    * 获取标签下的文章数量
    * @param {String} _id       文章ID
    * @param {Object} userId    用户ID，有值代表有登入
    * @return {Promise[ArticleDetail]} 承载 ArticleDetail 的 Promise 对象
    */
    getTagsArticleCount: async (userId) => {
        let tags = await tagsService.getTagsInfoList();
        let tagKey = [], query;
        tags.forEach(v => {
            if (v.ispublic === 0 ||
                (v.ispublic === 1 && userId) ||
                (v.ispublic === 2 && userId === v.creator.toString())
            ) {
                tagKey.push(v.tagCode)
            }
        })
        if (userId) {
            query = {
                "$or": [
                    { tags: { "$in": tagKey }, ispublic: 0 },
                    { tags: { "$in": tagKey }, ispublic: 1 },
                    { tags: { "$in": tagKey }, ispublic: 2, autor: userId }
                ]
            }
        } else {
            query = { tags: { "$in": tagKey }, ispublic: 0 }
        }
        return articleModel.aggregate([
            {
                $match: query
            },
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: "$tags",
                    count: { $sum: 1 }
                }
            }
        ])
    },

    /*
    * 一次性更新脚本；用于格式化数据
    */
    // updateArticleList: async () => {
    //     let result = await articleModel.find();
    //     for (var i = 0; i < result.length; i++) {
    //         result[i].ispublic = 1;
    //         result[i].tags = ["JS"];
    //         await result[i].save()
    //     }
    // }
}


module.exports = article