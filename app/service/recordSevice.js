const mongoose = require("mongoose");
const { recordCategoryModel, recordModel } = require("../models/record")
const record = {
    /*
    * 新增
    */
    addRecord: (params) => {
        return new Promise((resolve) => {
            let { category, tag, type, value, creator, time } = params;
            var instance = new recordModel({
                category, tag, type, value, creator, time
            })
            resolve(instance.save())
        })
    },
    addRecordCategory: (params) => {
        return new Promise((resolve, reject) => {
            let { name, type, hasTag, tags, unit, creator } = params;
            if (hasTag && (!tags || !tags.length)) {
                return reject({
                    msg: "新增分类错误",
                    state: 2,
                    __wj: true
                })
            }
            var instance = new recordCategoryModel({
                name, type, hasTag, tags, unit, creator
            })
            resolve(instance.save())
        })
    },
    /*
    * 删
    */
    delRecord: (_id) => {
        return recordModel.remove({ _id })
    },
    delRecordCategory: (_id) => {
        return recordCategoryModel.remove({ _id })
    },
    /*
    * 改
    */
    // updateRecord: (_id) => {
    //     return recordModel.remove({ _id })
    // },
    // updateRecordCategory: (_id) => {
    //     return recordCategoryModel.remove({ _id })
    // }

    /*
    * 查
    */
    getRecordList: ({ creator, category, tag, time }) => {

        let query = { creator: mongoose.Types.ObjectId(creator) }
        if (category) {
            query.category = mongoose.Types.ObjectId(category)
            if (tag) {
                query.tag = tag
            }
        }
        if (Array.isArray(time) && time.length >= 2) {

            // 　　$gte　　　 大于等于
            // 　　$lte　　　  小于等于
            query.time = { $gte: time[0], $lte: time[1] }
        }
        return recordModel.find(
            query,
            "category tag value time",
        )
            .populate({
                path: "category",
                select: "name unit"
            })
            .lean()
    },
    getRecordDetail: (_id) => {
        return recordModel.findById(_id)
    },
    getRecordCategoryList: (creator) => {
        let query = {
            "$or": [
                { type: 1 },
                { creator: mongoose.Types.ObjectId(creator) }
            ]
        }
        return recordCategoryModel.find(
            query,
            "name type tags hasTag unit graph",
        )
    }
}

module.exports = record