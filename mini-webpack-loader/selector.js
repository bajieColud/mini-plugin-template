
// 最简单的做法，直接给下个loader
module.exports = function (content) {
  this.cacheable()
  this.callback(null, content)
}
