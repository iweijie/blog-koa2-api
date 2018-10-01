let Chain = function () {
    this.store = [];
    this.add.apply(this, arguments)
}
Chain.prototype.add = function () {
    let store = this.store,
        i = 0,
        l = arguments.length;
    for (; i < l; i++) {
        if (typeof arguments[i] !== "function") {
            throw new Error("the parameter needs to be a function")
        }
        store.push(arguments[i])
    }
    return this;
}
Chain.prototype.remove = function () {
    let store = this.store,
        i = 0,
        j,
        len = store.length,
        l = arguments.length;
    for (; i < l; i++) {
        for (j = len - 1; j >= 0; j--) {
            if (arguments[i] === store[j]) {
                store.splice(j, 1)
            }
        }
    }
    return this;
}
Chain.prototype.index = 0;
Chain.prototype.start = (function () {
    let arg;
    return function (params) {
        arg = params || arg
        let fn = this.store[this.index]
        if (fn) {
            return fn(arg, this.next.bind(this))
        }
        arg = void 0;
    }
})()
Chain.prototype.next = function () {
    this.index++;
    let result = this.start();
    this.index--;
    return result
}

let chainofResposibility = function () {
    let chain = new Chain(...arguments);
    let fn = function (params) {
        return chain.start(params)
    }
    fn.add = chain.add.bind(chain)
    fn.remove = chain.remove.bind(chain)
    return fn
}
module.exports = chainofResposibility