var db = require("./mongoose")
var Schema = db.Schema

var reviewSchema =new Schema({
    // 关联文章ID
    articleId:{
        type: Schema.Types.ObjectId, 
        ref: 'article',
        required:true
    },
    // 评论人名称
    name:{  
        type:String,
        required:true
    },
    // 评论
    content:{  
        type:String,
        required:true
    },
    // 评论人ID ，非登入为空
    userId:{  
        type:String,
    },
    // 被评论人名称
    replyName:{  
        type:String,
    },
    // 被评论人名称ID ，非登入为空
    replyUserId:{  
        type:String,
    },
    // 评论时间
    createTime:{
        type:Number,
        default:Date.now()
    }, 

})

module.exports = db.model('review',reviewSchema);