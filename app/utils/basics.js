
const os = require('os');
// 时间格式化
var formatTime = function (timestamp, flag, separator) {
  var date = new Date(timestamp)
  var separator = separator || '-'
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  var min = date.getMinutes()
  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }
  if (h < 10) {
    h = '0' + h
  }
  if (min < 10) {
    min = '0' + min
  }
  if (!flag) {
    return y + separator + m + separator + d
  }
  return y + separator + m + separator + d + ' ' + h + ':' + min
}
// 获取IP 地址
var getClientIp = function (req) {
  if (!req) return ""
  var ip = req.headers['x-forwarded-for'] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress || '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0]
  }
  return ip;
};

// 差值对比
let diff = (newValue, oldValue) => {
  newValue = newValue && newValue.length ? newValue : []
  oldValue = oldValue && oldValue.length ? oldValue : []
  let add = [];
  let remove = [];
  for (let i = 0; i < newValue.length; i++) {
    if (!oldValue.includes(newValue[i])) {
      add.push(newValue[i])
    }
  }
  for (let i = 0; i < oldValue.length; i++) {
    if (!newValue.includes(oldValue[i])) {
      remove.push(oldValue[i])
    }
  }
  return {
    add,
    remove
  }
}

// 字符串特殊符号转字符实体
function stringToEntity(str) {
  let reg = /<|>|"|'|;|=|%|\||\//g
  return str.replace(reg,function(match){
      return '&#' + match.charCodeAt()+ ';'
      // return '&#x' + match.charCodeAt().toString(16) + ';'
  })
}
module.exports = {
  stringToEntity,
  formatTime,
  getClientIp,
  diff
}
