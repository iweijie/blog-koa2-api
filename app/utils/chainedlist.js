
// const store = Symbol? Symbol("store") : "__store__"
// const Chained = function(){}

// Chained.prototype[store] = [];
// Chained.prototype.__index = 0;
// Chained.prototype.__params = null;
// Chained.prototype.add = function(...arg){
//     let l = arg.length,i = 0;
//     for(;i<l;i++ ){
//         let fn = arg[i]
//         if(typeof fn !== "function") throw new Error("参数需为函数");
//         this[store].push(fn)
//     }
// }
// Chained.prototype.remove = function(fn){
//     let l = this[store].length,i = 0;
//     for(;i<l;i++ ){
//         if(fn === this[store][i] ){
//             return this[store].splice(i,1)
//         }
//     }
// }
// Chained.prototype.next = function(){
//     if()
// }
// Chained.prototype.reset = function(){
//     this.
// }
// var Test = function(){
//     let fn = function(...arg){
//         var _this = fn.prototype;
//         var _self = this;
//         var callBack = _this[store][_this.__index];
//         arg.push(_this.next)
//         callBack.apply(_self,arg)
//     }
//     fn.prototype = new Chained()
//     return fn
// }
// var a = new Chained()
// a.add(fn1,fn2,fn3)
// a(1,3,4)

// var fn1 = (1,3,4,next)=>{
//     if(a === 1){

//     }else {
//         next()
//     }
// }