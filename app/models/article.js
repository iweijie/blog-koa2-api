var db = require("./mongoose")
var Schema = db.Schema

var leaveSchema =new Schema({
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
    createTime:{type:Number}, 

})
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
    leave :[leaveSchema]
})
module.exports = db.model('article',articleSchema);
