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

// 去除前后空格
var trim = function(str){
    var trim = String.prototype.trim
    if(trim) return str.trim()
    return str.replace(/^\s*|\s*$/g,'')
}
// 获取IP 地址
var getClientIp = function(req) {
  if(!req) return ""
  var ip = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  if(ip.split(',').length>0){
      ip = ip.split(',')[0]
  }
  return ip;
};

// 获取随机数
// function random(length=5){
//   if(length > 10) return 0
//   var l = 15 -length;
//   var r = Math.random();
//   var start = Math.floor(r*l) + 2;
//   var str = r.toString().slice(start,length+start)
//   return str
// }
module.exports = {
    formatTime,
    trim,
    getClientIp,
    // random
}
