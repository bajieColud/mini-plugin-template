const cache = require('lru-cache')(100)
const hash = require('hash-sum')
const compiler = require('./template-compiler/compiler')

module.exports = (content) => {
  // 缓存需要mode隔离，不同mode经过区块条件编译parseComponent得到的内容并不一致
  console.log('#####content is ',this)
  const cacheKey = hash(filePath + content + mode)
  let output = cache.get(cacheKey)
  if (output) return JSON.parse(output)
  output = compiler.parseComponent(content)
  // 使用JSON.stringify进行序列化缓存，避免修改输出对象时影响到缓存
  cache.set(cacheKey, JSON.stringify(output))
  return output
}