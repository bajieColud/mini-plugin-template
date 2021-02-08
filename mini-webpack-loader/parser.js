const LruCache = require('lru-cache')
const hash = require('hash-sum')
const compiler = require('./template-compiler/compiler')

 const cache = new LruCache(100)
module.exports = (content,{mode,filePath}) => {
  //缓存需要mode隔离，不同mode经过区块条件编译parseComponent得到的内容并不一致
  const cacheKey = hash(filePath + content + mode)
 let output = cache.get(cacheKey)
  if (output) return JSON.parse(output)
 // output = compiler.parse(content)
 // 使用JSON.stringify进行序列化缓存，避免修改输出对象时影响到缓存
  cache.set(cacheKey, JSON.stringify(output))

  let scriptContent='let a = {};\n export default a';
  // if (output.script) {
  //   scriptContent = output.script.children.text;
  // }else {
    
  //   scriptContent = 'export default {}';
  // }
  return scriptContent
}