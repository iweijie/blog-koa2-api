var myError = function (params) {
    let {msg = "Not Find" , state = 0 } = params ;
    let err = new Error(msg);
    err._state = state
}
myError.prototype.mark = (()=>{
    let mark = "__wj_error"
    if(Symbol) return Symbol(mark)
    return mark ;
})();
module.exports = myError
