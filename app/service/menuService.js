const menuModel = require("../models/menu")
const {myError} =  require("../utils/basics")

/**
* author：weijie
* describe： 格式化菜单数据
* @param {Array} arr 菜单原生数据
* @param {Boolean} islogin 是否登入,默认false
* @param {Boolean} index 层级
* @param {String} _id 上一层 菜单ID
* @param {String} path 上一层 菜单路径
* @return {Array} 格式化菜单列表
*/
function getMenuList(arr,islogin=false,index=1,_id ="",path =""){
    var list = [],
        current;
    if(!arr || !arr.length) return list
    for(var l=arr.length,i=l-1;i>=0;i--){
        if(!arr[i] || (!islogin && !arr[i].isPublic)) continue;
        if(!arr[i].parent && index == 1){
            current = arr.splice(i,1)[0]
            list.push(current)
        }else {
            if(arr[i].level == index && _id == arr[i].parent){
                current = arr.splice(i,1)[0]
                current.url = path + current.url
                list.push(current)
            }
        }
        if(current){
            current.childrens = getMenuList(arr,islogin,index+1,current._id,current.url)
            current = null
        }
    }
    return list
}


const menu = {
    /**
    * author：weijie
    * describe： 获取所有菜单数据
    * @param {Boolean} islogin 是否登入,默认false
    * @return {Promise} 返回格式化菜单列表信息的Promise
    */
    getMenu:( islogin = false )=>{
        // lean 将mongoose 对象转为普通对象
        return  menuModel.find({},"id url parent isPublic level title children classify")
                .lean()
                .exec()
                .then(reuslt=>{
                    reuslt.forEach(v=>{
                        v._id = v._id.toString()
                    })
                    return getMenuList(reuslt,islogin)
                })
    },
    getFormatMenu:getMenuList,
    /**
    * author：weijie
    * describe： 添加菜单数据
    * @param {String} title 标题
    * @param {String} url   路径
    * @param {String} parent   父级ID
    * @param {String} isPublic   是否公开（非公开需要登入查看）
    * @param {String} level   层级
    * @param {String} classify   当前菜单所属类型
    * @return {Promise} 
    */
    addMenu:( title,url,parent,isPublic,level,classify )=>{
        let menuInstance = new menuModel({
            title,url,parent,isPublic,level,classify
        })
        return menuInstance.save()
    },
    /**
    * author：weijie
    * describe： 修改/设置菜单数据
    * @param {String} _id ID
    * @param {String} title 标题
    * @param {String} url   路径
    * @param {String} isPublic   是否公开（非公开需要登入查看）
    * @param {String} classify   当前菜单所属类型
    * @return {Promise} 
    */
    setMenu:( _id,title,url,isPublic,classify )=>{
        if(!_id || !url) {
            myError("修改失败")
        }
        var setParams = {
            title,url,isPublic,classify
        }
        return menuModel.findByIdAndUpdate(_id,{$set:setParams}).exec()
    },
    /**
    * author：weijie
    * describe： 获取当前ID项的菜单数据
    * @param {String} ID
    * @return {Promise} 
    */
    findMenu:( _id )=>{
        if(!_id) {
            myError("获取菜单信息失败")
        }
        return menuModel.findById(_id).exec()
    },
    /**
    * author：weijie
    * describe： 删除当前ID项的菜单数据 以及其子项的菜单数据
    * @param {String} ID
    * @return {Promise} 
    */
    removeMenu:( _id )=>{
        if(!_id) {
            myError("ID为必传字段")
        }
        let uid = 0
        var removeChildrens = (resolve,reject,_id)=>{
            uid ++ 
            menuModel.find({parent:_id})
            .then(result=>{
                var l = result.length;
                menuModel.remove({_id})
                .then(result=>{
                    uid --;
                    if(!uid){
                        resolve(true)
                    }
                })
                if(l) {
                    for(var i=0;i<l;i++ ){
                        removeChildrens(resolve,reject,result[i].id)
                    }
                }
            })
        }
        return new Promise((resolve,reject)=>{
            removeChildrens(resolve,reject,_id)
        })
    },
}

module.exports = menu