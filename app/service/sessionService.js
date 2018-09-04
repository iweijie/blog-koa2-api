const sessionModel = require("../models/session")
const usernModel = require("../models/user")
const config = require("../../config/index")


var crypto = require("../utils/crypto")
var basics = require("../util/basics")
var os = require("os")
var {aesEncrypt,aesDecrypt,uuid} = crypto
var {get_client_ip} = basics

function Mysession(){
    this.uid = uuid.v4()
    this.info = {}
    this.islogin = false
    this.userId = ""
}
Mysession.prototype.save = function(userId,expires){
    if(!userId) throw new Error("userId 为必传")
    if(!this.uid || !this.info) throw new Error("session 生成异常")
    var sessionInfo ;
    var info = JSON.stringify(this.info)
    if(expires){
        expires = +new Date() +  expires*1000 ;
        sessionInfo = new sessionModel({
            userId,
            expires,info,
            _id:this.uid
        })
    }else {
        sessionInfo = new sessionModel({
            userId,
            info,
            _id:this.uid
        })
    }
    return sessionInfo.save()
}
Mysession.prototype.setSessionCookie = function(res){
    this.setCookie(res,"session",this.uid)     
    this.setCookie(res,"refreshsession",aesEncrypt(this.info),{maxAge:3*24*60*60*1000})                                                                             
}
Mysession.prototype.setCookie = function(res,name,value,options={}){
    var defaultOptions = { 
        maxAge:60*60*1000, 
        path:'/',
        secure:false,
        httpOnly:true
    }
    for(var k in defaultOptions){
        if(!options[k]){
            options[k] = defaultOptions[k]
        }
    }
    res.cookie(name,value,options);                                                                                             
}
// Mysession.prototype.getSessionID = function(){ 
//     this.uid = uid(24);
//     return this.uid
// }
Mysession.prototype.setInfo = function(req){
    var ip = get_client_ip(req)
    var arch = os.arch()
    var hostname = os.hostname()
    var expires = +new Date + 3*24*60*1000
    this.info = {
        ip,arch,hostname,_id:this.uid,expires
    }
}
Mysession.prototype.refresh = function(_id,res){
   return sessionModel.findById(_id)
    .then(result=>{
        if(!result) {
            res.clearCookie('session');
            res.clearCookie('refreshsession');
            throw new Error("session 获取错误")
        }
        sessionModel.remove({_id})
        var userId = result.userId
        return this.save(userId)
    })
    .then(result=>{
        if(result){
            this.setSessionCookie(res)
            return result
        }
        return false
    })
    .catch(err=>{throw err})
}


function session(req,res,next){
    var method = req.method && req.method.toUpperCase && req.method.toUpperCase();
    if (method === 'OPTIONS') {
        return next()
    }
    if(req.mySessionID ||req.mySession){
        throw new Error("mySessionID is exist");
    }else {
        var Mysession =  new Mysession()
        // req.mySessionID = Mysession.getSessionID()
        req.mySession = Mysession
        Mysession.setInfo(req)
        next()
    }
} 
module.exports = session