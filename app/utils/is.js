let toString = Object.prototype.toString;
let isNaN = Number.isNaN || function(p){return typeof p === "number" && p !== p}
let is = {
    Number:(p)=>{
        if(isNaN(p)) return false;
        return toString.call(p) === "[object Number]"
    },
    String:(p)=>{
        return toString.call(p) === "[object String]"
    },
    Boolean:(p)=>{
        return toString.call(p) === "[object Boolean]"
    },
    Undefined:(p)=>{
        return toString.call(p) === "[object Undefined]"
    },
    Null:(p)=>{
        return toString.call(p) === "[object Null]"
    },
    Symbol:(p)=>{
        return toString.call(p) === "[object Symbol]"
    },
    Object:(p)=>{
        return toString.call(p) === "[object Object]"
    },
    Array:(p)=>{
        return toString.call(p) === "[object Array]"
    },
    Function:(p)=>{
        return toString.call(p) === "[object Function]"
    },
    isNaN:isNaN
}
module.exports = is