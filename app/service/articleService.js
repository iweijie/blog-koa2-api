const articleModel = require("../models/article")

const ArticleService = {
    get:async (ctx,next)=> {

    }
}


// var fs = require('fs');
var express = require('express');
var article = require('../models/article');
var user = require("../models/user")
var router = express.Router();
var syncModalFn = require("../util/syncCallback")
var { islogin, isloginNext } = require("../middleware/isLogin")


router.get('/get', isloginNext, function(req, res, next) {

    var { id } = req.query;
    var userId = req.mySession.userId;
    var islogin = req.mySession.islogin;
    if (!id) return res.status(200).json({ state: 0, msg: "请传入正确的参数" })
    article
        .findOne({ _id: id }, "title description classify time ispublic content createTime updateTime autor leave")
        .populate({
            path: "autor",
            select: "name"
        })
        .exec()
        .then(function(result) {
            if (result) {
                if (result.ispublic) return res.json({ state: 1, result: result })
                if (userId === result.autor.id) return res.json({ state: 1, result: result })
                return res.json({ state: 2, msg: "获取错误" })
            } else {
                res.json({ state: 2, msg: "获取错误" })
            }
        })
        .catch(err => {
            res.status(500).json({ state: 0, msg: "获取错误" })
        })

})

router.post('/add', isloginNext, function(req, res, next) {
    var userId = req.mySession.userId;
    var islogin = req.mySession.islogin;
    var { title, classify, description, time, ispublic, content, autor, id } = req.body;
    if (id) {
        if (autor !== userId) return res.json({ state: 0, msg: "修改错误" });
        article.findByIdAndUpdate(id, { $set: { title, classify, description, ispublic, content } })
            .then(result => {
                if (result) {
                    return res.json({ state: 1, msg: "修改成功" });
                }
                res.json({ state: 0, msg: "当前文章不存在" });
            }).catch(err => {
                res.status(500).json({ state: 0, msg: err.message });
            })
        return
    }

    var nowtime = +new Date();
    var articleInstance = new article({
        title,
        classify,
        description,
        time,
        ispublic,
        content,
        autor,
        createTime: nowtime,
        updateTime: nowtime,
    })
    articleInstance.save()
        .then(function(result) {
            if (result) {
                return res.json({ state: 1, msg: "保存成功" });
            }
            res.json({ state: 0, msg: "保存失败" });
        }).catch(err => {
            res.status(500).json({ state: 0, msg: err.message });
        })
})

router.post('/list', isloginNext, function(req, res, next) {
    var { id, page, pageSize } = req.body;
    var userId = req.mySession.userId;
    var islogin = req.mySession.islogin;
    if (islogin) {
        article.find({ "$or": [{ classify: id, ispublic: true }, { classify: id, autor: userId }] },
                "title description classify createTime autor time", { skip: (page - 1) * pageSize, limit: pageSize }
            )
            .populate({
                path: "autor",
                select: "name"
            })
            .sort({ "createTime": -1 })
            .then(result => {
                res.json({ state: 1, result });
            })
            .catch(err => {
                res.status(500).json({ state: 0, msg: err.message });
            })
    } else {
        article.find({ classify: id, ispublic: true },
                "title description classify createTime autor time", { skip: (page - 1) * pageSize, limit: pageSize }
            )
            .populate({
                path: "autor",
                select: "name"
            })
            .sort({ "createTime": -1 })
            .then(result => {
                res.json({ state: 1, result });
            })
            .catch(err => {
                res.status(500).json({ state: 0, msg: err.message });
            })
    }

})
router.post('/leave', function(req, res, next) {
    var { userId, name, leave, articleId,replyName,replyUserId } = req.body;
    if (!articleId) return res.json({ msg: "当前文章不存在", state: 0 })
    var params = { content: leave,createTime: +new Date }
    new Promise(function(resolve, reject) {
            if (userId) {
                user.findById(userId)
                    .then(result => {
                        if (result) {
                            params.name = result.name
                            params.userId = userId
                            resolve(params)
                            return
                        }
                        reject("当前userId不存在")
                    })
            } else {
                params.name = name
                params.userId = ""
                resolve(params)
            }
        })
        .then(result => {
            if(replyName){
                result.replyName = replyName
            }
            if(replyUserId){
                result.replyUserId = replyUserId
            }
            article.findByIdAndUpdate(articleId, { $push: { leave: params } },{ new : true})
                .then(result => {
                    if (result) {
                        return res.json({ msg: "成功", state: 1, result:result.leave })
                    }
                    res.json({ msg: "保存失败", state: 0 })
                })
        })
        .catch(err => {
            res.status(500).json({ state: 0, msg: err.message });
        })
})
router.post('/time', function(req, res, next) {
    var { id ,time} = req.body;
    article.findByIdAndUpdate(id,{ $set: { time: time+1 }})
    .then(reslut=>{
        res.json({ state: 1, msg: "update" });
    })
    .catch(err => {
        res.status(500).json({ state: 0, msg: err.message });
    })
})
module.exports = router