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
module.exports = {
    formatTime,
    getClientIp,
}
