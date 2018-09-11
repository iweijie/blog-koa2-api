var db = require('./mongoose.js')
var Schema = db.Schema;
var userSchema =new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true 
    },
    name:{type:String},
    LastLoginTime:{
        type: Number,
    },
})
module.exports  = db.model('user',userSchema);