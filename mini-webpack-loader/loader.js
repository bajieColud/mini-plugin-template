const async = require('async')
const fs = require('fs');
const loaderUtils = require('loader-utils')
var parser = require('./parser');
let templateMl = require('./template')
let jsonMl = require('./json');
var {
  getFileInfo
} = require('./helper/util');


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

 // console.log('####parts is ',parts.script,parts.script.children);

  let output = '';
  let {path,name} = getFileInfo(resourcePath,context)
  async.waterfall([
    (callback) => {
     // 这里处理template
      let template = parts.template 
      if (template) {
          let templateStr = templateMl(template , fileExt)
          emitFile(`${path}/${name}${fileExt.template}`,templateStr)
          callback();
      }else{
        callback();
      }
    },
    (callback) =>{
      // 处理less文件
      callback();
    },
    (callback) =>{
      // 处理json文件
      let jsonPath = resourcePath.replace(/.*\/(.*)\.sqb/,function($0,$1){
        return `${context}/${$1}.json`
      })
     try {
      let jsonContent = fs.readFileSync(jsonPath,'utf-8');
      jsonContent = jsonContent.trim();
      if (jsonContent) {
        let jsonStr = jsonMl(jsonContent,{fileExt})
        emitFile(`${path}/${name}${fileExt.json}`,jsonStr)
      }

      callback();
     }catch(err){
       // 读取文件错误，直接callback();
       callback();
     }
   
    },
    (callback) => {
      // 这里处理script内容
      output = ''
      if (parts.script && parts.script.children.length) {
        output = parts.script.children[0].text;
      }
      callback(null,output)
    },
  ],callback);
}