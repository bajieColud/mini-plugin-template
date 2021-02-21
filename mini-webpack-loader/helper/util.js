
const relative = require('relative')

// 获取dist目录下的位置
function getFileInfo(filePath,context) {
  console.log('#########3getFileInfo is ',context)
 const path = context.replace(/.*src\/(?:miniprogram|plugin)\/?/,'')
 const name = filePath.replace(/(?:.*)\/(.*)\.(?:js|sqb)/,function($0,$1){ return $1})

 return {
   path,
   name
 }
}

module.exports = {
  getFileInfo
}