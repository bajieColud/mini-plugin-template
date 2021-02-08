const async = require('async')
const loaderUtils = require('loader-utils')
var parser = require('./parser');
let templateMl = require('./template')
var {
  getFileInfo
} = require('./helper/util')


module.exports = function(content) {

  const options = loaderUtils.getOptions(this) || {}
  let  { fileExt} = options;
  const { emitFile,resourcePath,context} = this
  this.cacheable(); //缓存该loader的输出
  const callback = this.async()

  let parts = parser(content,{
    filePath:resourcePath,
    mode:'dev'
  });

  let output = '';
  async.waterfall([
    (callback) => {
     // 这里处理template
      let template = parts.template 
      if (template) {
          let templateStr = templateMl(template , {})
          let {path,name} = getFileInfo(resourcePath,context)
          console.log('###path is ',path,name)
          emitFile(`${path}/${name}${fileExt.template}`,templateStr)
          callback();
      }else{
        callback();
      }
    },
    (callback) => {
      // 这里处理script内容
      output = 'export default {};'
      callback(null,output)
    },
  ],callback);
}