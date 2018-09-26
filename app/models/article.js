var db = require("./mongoose")
var Schema = db.Schema

var articleSchema =new Schema({
    title:{  //文章标题
        type:String,
        required:true
    },
    description:{  //描述
        type:String,
    },
    classify:{  //分类
        type:String,
        required:true
    },
    // 标签
    tags:[String],
    time:{ // 查看次数
        type:Number,
        default:0
    },
    ispublic:{
        type:Boolean,
        required:true
    },
    content:{ //内容
        type:String,
        required:true
    },
    createTime:{type:Number}, // 编写时间
    updateTime:{type:Number}, // 更新时间
    autor :{type: Schema.Types.ObjectId, ref: 'user' },//作者
    // 评论
    // review :[reviewSchema]
})
module.exports = db.model('article',articleSchema);
