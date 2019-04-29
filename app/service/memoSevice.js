const mongoose = require("mongoose");
const { memoCategoryModel, memoModel } = require("../models/memo")
const memo = {
    /*
    * 新增
    */
    addMemo: (params) => {
        return new Promise((resolve) => {
            let { category, tag, type, value, creator, time } = params;
            var instance = new memoModel({
                category, tag, type, value, creator, time
            })
            resolve(instance.save())
        })
    },
    addMemoCategory: (params) => {
        return new Promise((resolve, reject) => {
            let { name, type, hasTag, tags, unit, creator } = params;
            if (hasTag && (!tags || !tags.length)) {
                return reject({
                    msg: "新增分类错误",
                    state: 2,
                    __wj: true
                })
            }
            var instance = new memoCategoryModel({
                name, type, hasTag, tags, unit, creator
            })
            resolve(instance.save())
        })
    },
    /*
    * 删
    */
    delMemo: (_id) => {
        return memoModel.remove({ _id })
    },
    delMemoCategory: (_id) => {
        return memoCategoryModel.remove({ _id })
    },
    /*
    * 改
    */
    // updateMemo: (_id) => {
    //     return memoModel.remove({ _id })
    // },
    // updateMemoCategory: (_id) => {
    //     return memoCategoryModel.remove({ _id })
    // }

    /*
    * 查
    */
    getMemoList: ({ creator, category, tag, time }) => {

        let query = { category: mongoose.Types.ObjectId(category), creator: mongoose.Types.ObjectId(userId) }
        if (tag) {
            query.tags = { "$in": [tag] }
        }
        if (Array.isArray(time) && time.length >= 2) {

            // 　　$gte　　　 大于等于
            // 　　$lte　　　  小于等于
            query.time = { time: { $gte: time[0], $lte: time[1] } }
        }
        return memoModel.find(
            query,
            "category tag value time",
        )
    },
    getMemoDetail: (_id) => {
        return memoModel.findById(_id)
    },
    getMemoCategoryList: (creator) => {
        let query = {
            "$or": [
                { type: 1 },
                { creator: mongoose.Types.ObjectId(creator) }
            ]
        }
        return memoModel.find(
            query,
            "name type tags hasTag unit",
        )
    }
}