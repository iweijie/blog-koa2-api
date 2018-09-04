var db = require('./mongoose.js')
var Schema = db.Schema;


var menuConfig =new Schema({
    title:{type:String,required:true },//菜单名称
    url:{type:String },//路径
    parent:{type:Schema.Types.Mixed}, // 父级菜单Id
    isPublic:{type:Boolean}, // 是否公开
    level:{type:Number}, // 层级
    classify:{type:String}, // 分类
    manner:{type:String}
})

module.exports = db.model('config-menu',menuConfig)