var db = require("./mongoose")
var Schema = db.Schema

var selftalkingSchema = new Schema({
    // 内容
    content: {
        type: String,
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
        default: Date.now()
    }
})
module.exports = db.model('selftalking', selftalkingSchema);
