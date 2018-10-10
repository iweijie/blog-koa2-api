var db = require('./mongoose.js')
var Schema = db.Schema;
var sessionSchema =new Schema({
    _id:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    expires:{
        type:Number,
        required:true,
        // default:(Date.now() + 3*24*60*1000)
    },
    info:{
        type: String,
        required:true
    },
})
module.exports  = db.model('session',sessionSchema);