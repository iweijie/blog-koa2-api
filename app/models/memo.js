var db = require("./mongoose")
var Schema = db.Schema

var memoCategorySchema = new Schema({
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

var memoSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'memoCategory'
    },
    // category: {
    //     type: String,
    //     required: true
    // },
    // 标签
    tag: String,
    // 1 : 条形图 ； 2 饼状图
    type: {
        type: Number,
        required: true
    },
    // 时间  案例 ： 20190616
    time: {
        type: String,
        required: true
    },
    value: Schema.Types.Mixed,
    creator: { type: Schema.Types.ObjectId, required: true, ref: 'user' },//用户
})
module.exports = {
    memoCategoryModel: db.model('memoCategory', memoCategorySchema),
    memoModel: db.model('memo', memoSchema),
}
