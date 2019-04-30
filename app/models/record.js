var db = require("./mongoose")
var Schema = db.Schema

var recordCategorySchema = new Schema({
    //分类名称
    name: {
        type: String,
        required: true
    },
    // 1 通用 ； 2 ： 私有
    type: {
        type: Number,
        required: true
    },
    // 1 : 条形图 ； 2 饼状图 ； 3 散点图
    graph: {
        type: Number,
        default: 1
    },
    // 是否有标签
    hasTag: {
        type: Boolean,
        default: false
    },
    // 标签
    tags: [String],
    // 单位
    unit: String,
    creator: { type: Schema.Types.ObjectId, required: true, ref: 'user' },//用户
})

var recordSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'recordCategory'
    },
    // 标签
    tag: String,
    // 时间  案例 ： 20190616
    time: {
        type: Number,
        required: true
    },
    value: Schema.Types.Mixed,
    creator: { type: Schema.Types.ObjectId, required: true, ref: 'user' },//用户
})
module.exports = {
    recordCategoryModel: db.model('recordCategory', recordCategorySchema),
    recordModel: db.model('record', recordSchema),
}
