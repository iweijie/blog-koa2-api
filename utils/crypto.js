const crypto = require('crypto');
const {salt} = require('../config/index');
var uid = require('uid-safe').sync
// 加密
function aesEncrypt(data, key = salt) {
    if(typeof data == "object"){
        data = JSON.stringify(data)
    }
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
// 解密
function aesDecrypt(encrypted, key = salt) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    try {
        return JSON.parse(decrypted)
    }catch(err) {
        return decrypted;
    }
}


module.exports = {
    aesEncrypt,
    aesDecrypt,
    uid
}