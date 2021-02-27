const async = require('async')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
const relative = require('relative')
const fs = require('fs');
const less = require('less-loader');
const loaderUtils = require('loader-utils')
var parser = require('./parser');
let templateMl = require('./template')
let jsonMl = require('./json');

var {
  getFileInfo
} = require('./helper/util');


let defaultLoaders = {
  'style':ExtractTextPlugin.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "less-loader"
            }],
        })
}




module.exports = function(content) {
  const options = loaderUtils.getOptions(this) || {}
  let  { fileExt, loaderContext} = options;
  const { emitFile,resourcePath,context,rawRequest} = this
  console.log('#########3this is ',this)
  this.cacheable(); //缓存该loader的输出
  const callback = this.async()


  let loaderCtx = this;
  let parts = parser(content,{
    filePath:resourcePath
  });


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
      // **注入less inline-loader,让webpack进行编译
      let lessPath = resourcePath.replace(/.*\/(.*)\.sqb/,function($0,$1){
        return `${context}/${$1}.less`
      })

      fs.access(lessPath, fs.F_OK, (err) => {
        // 不存在
        if(err) {
           callback();
           return;
        }

        let injectStyle = '\n'+
        'function injectStyle(){\n'+
        getRequire('style',`${name}.less`)+
        ';\n}'

        output+=injectStyle;
        // 
        callback();
      });
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
      if (parts.script && parts.script.children.length) {
        output += parts.script.children[0].text;
      }
      callback(null,output)
    },
  ],callback);

  function getRequire (type,filename) {
    return `require(${getRequireString(type)})`
  }

  function getRequireString (type) {
    return loaderUtils.stringifyRequest(loaderCtx,
      // ！！ 失效所有配置的loader
      '!!' +
      // 获取loader
      getLoaderString(type) +
      // 获取selector 拿到source 传给loader
      getSelectorString(type) +
      '!./'+
      getFileName(type)
    )
  }

  function getSelectorString(type){
    const relativePath = relative(context,loaderContext);
    return `!${relativePath}/selector.js?type=${type}`
  }

  function getFileName(type) {
    switch(type) {
      case 'style':
        return `${name}.less`
    }
  }

  function getLoaderString (type) {
    switch(type){
      case 'style':{
        let loader = defaultLoaders[type]
        return stringfyLoaders(loader)
      }
    }
  }

  function stringfyLoaders(loaders) {
      return loaders.map((l)=>{
        return l.loader
      }).join('!')
  }
}