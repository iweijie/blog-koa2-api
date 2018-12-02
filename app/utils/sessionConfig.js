
const {
    getSession,
    setSession,
    delSession,
} = require('../service/sessionService');

module.exports = {
    key: 'token',
    maxAge: 3 * 24 * 60 * 60,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    store: {
        get(key, maxAge, other) {
            console.log(key)
            console.log(maxAge)
            console.log(other)
        },
        set(key, sess, maxAge, other) {
            // { rolling, changed }
            console.log(key)
            console.log(sess)
            console.log(maxAge)
            console.log(other)
        },
        destroy(key) {

            console.log(key)
        }
    }
};