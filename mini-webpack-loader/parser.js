const LruCache = require('lru-cache')
const hash = require('hash-sum')
const compiler = require('./template-compiler/compiler')

 const cache = new LruCache(100)
module.exports = (content,filePath) => {
  //缓存需要mode隔离，不同mode经过区块条件编译parseComponent得到的内容并不一致
  const cacheKey = hash(filePath + content)
 let output = cache.get(cacheKey)
  if (output) return JSON.parse(output)
  output = compiler.parse(content) || {};
 // 不能使用JSON.stringfy存储，里面有指针指向父节点
  cache.set(cacheKey, output)
  return output
}