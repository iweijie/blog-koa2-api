const mongoose = require("mongoose");
const articleModel = require("../models/article")
const reviewService = require("./reviewService")
const tagsService = require("./tagsService")

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
                        { tags: { "$in": [tag] }, ispublic: 2, autor: mongoose.Types.ObjectId(userId) }
                    ]
                }
            } else {
                query = { "$or": [{ ispublic: 0 }, { ispublic: 1 }, { autor: mongoose.Types.ObjectId(userId) }] }
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
        return new Promise((resolve, reject) => {
            let { id, tags, title, description, ispublic, content } = params;
            if (!id || !tags || !title || !description || ispublic === undefined || !content) {
                return reject({
                    msg: "修改文章错误",
                    state: 2,
                    __wj: true
                })
            }
            var nowtime = Date.now()
            resolve(articleModel.findOneAndUpdate({ _id: id }, { $set: { title, tags, description, ispublic, content, updateTime: nowtime } }).exec());
        })
    },
    /*
    * 新增文章详情
    */
    addArticlDetail: (params) => {
        return new Promise((resolve, reject) => {
            let { title, tags, description, ispublic, content, autor } = params;
            if (!title || !tags || !description || ispublic === undefined || !content || !autor) {
                return reject({
                    msg: "新增文章错误",
                    state: 2,
                    __wj: true
                })
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
            resolve(articleInstance.save())
        })
    },
    /*
    * 依据文章ID获取文章详情
    * @param {String} _id       文章ID
    * @param {Object} userId    用户ID，有值代表有登入
    * @return {Promise[ArticleDetail]} 承载 ArticleDetail 的 Promise 对象
    */
    getArticleDetail: async (_id, userId, field = "title description tags time ispublic content createTime updateTime autor") => {
        return new Promise(async (resolve, reject) => {
            if (!_id) {
                return reject({
                    msg: "ID 为必传字段",
                    state: 0,
                    __wj: true
                })
            }
            await Promise.all([
                articleModel.findById(
                    _id,
                    field
                )
                    .populate({
                        path: "autor",
                        select: "name"
                    })
                    .lean()
                    .exec(),
                reviewService.getReview(_id)
            ])
                .then(result => {
                    if (!result || !result[0]) {
                        return reject({
                            msg: "文章不存在",
                            state: 0,
                            __wj: true
                        })
                    }
                    let articleDetail = result[0]
                    articleDetail.review = result[1] || []
                    return articleDetail
                })
                .then(result => {
                    if (result &&
                        (result.ispublic === 0 ||
                            (userId && result.ispublic === 1) ||
                            (userId && userId === result.autor._id.toString())
                        )
                    ) return resolve(result);
                    
                    reject({
                        msg: "文章不存在",
                        state: 0,
                        __wj: true
                    })
                })
        })
    },
    /*
    * 获取标签下的文章数量
    * @param {String} _id       文章ID
    * @param {Object} userId    用户ID，有值代表有登入
    * @return {Promise[ArticleDetail]} 承载 ArticleDetail 的 Promise 对象
    */
    getTagsArticleCount: async (userId) => {
        return Promise.resolve()
            .then(async () => {
                let tags = await tagsService.getTagsInfoList(userId);
                let tagKey = [], query, selectTags = [];
                tags.forEach(v => {
                    if (v.ispublic === 0 ||
                        (v.ispublic === 1 && userId) ||
                        (v.ispublic === 2 && userId === v.creator.toString())
                    ) {
                        tagKey.push(v.tagCode)
                        selectTags.push(v)
                    }
                })
                if (userId) {
                    query = {
                        "$or": [
                            { tags: { "$in": tagKey }, ispublic: 0 },
                            { tags: { "$in": tagKey }, ispublic: 1 },
                            { tags: { "$in": tagKey }, ispublic: 2, autor: mongoose.Types.ObjectId(userId) }
                        ]
                    }
                } else {
                    query = { tags: { "$in": tagKey }, ispublic: 0 }
                }
                let result = await articleModel.aggregate([
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
                let returnArr = [];
                if (result && result.length && selectTags && selectTags.length) {
                    for (let i = 0; i < result.length; i++) {
                        for (let l = 0; l < tags.length; l++) {
                            if (result[i]._id === selectTags[l].tagCode) {
                                returnArr.push({
                                    tagCode: selectTags[l].tagCode,
                                    tagName: selectTags[l].tagName,
                                    count: result[i].count
                                })
                            }
                        }
                    }
                }
                return returnArr
            })

    },

    /*
    * 推荐文章列表
    * @return {Promise[ArticleDetail]} 承载 ArticleDetail 的 Promise 对象
    */
    getRecommendList: () => {
        return articleModel.find(
            { ispublic: 0 },
            "title",
            { skip: 0, limit: 10 }
        )
            .sort({ "time": -1 })
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