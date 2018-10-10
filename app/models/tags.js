var db = require("./mongoose")
var Schema = db.Schema

var tagsSchema = new Schema({
    // 标签名称
    tagName: {
        type: String,
        required: true
    },
    // 标签编码
    tagCode: {
        type: String,
        required: true
    },
    //描述
    description: {
        type: String,
    },
    // 关联文章数量
    sum: {
        type: Number,
        default: 0
    },
    // 当前标签是否公开
    // 0：全部人可见；1：登入可见；2：仅自己可见
    ispublic: {
        type: Number,
        required: true
    },
    // 创建人
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'user' 
    },
     // 创建时间
    createTime: {
        type: Number,
    }
})
module.exports = db.model('tag', tagsSchema);
