const mongoose = require("mongoose");
const selftalkingModel = require("../models/selftalking")

const selftalking = {
    /*
    * 新增记录
    * @param {String} token      
    * @return {Promise[session]} 承载 session 的 Promise 对象
    */
    addSelftalking: ({ content, creator }) => {
        let instance = new selftalkingModel({
            content,
            creator
        })
        return instance.save()
    },
    /*
    * 查询记录列表    
    * @return {Promise[session]} 承载 session 的 Promise 对象
    */
    getSelftalkingList: (page = 1, pageSize = 20) => {
        return selftalkingModel.find(
            {},
            null,
            { skip: (page - 1) * pageSize, limit: pageSize }
        )
        .populate({
            path: "creator",
            select: "name"
        })
        .sort({ "createTime": -1 })
        .lean()

    },
    /*
    * 查询记录列表总数    
    */
    getSelftalkingListCount:()=>{
        return selftalkingModel.countDocuments()
    }
}

module.exports = selftalking