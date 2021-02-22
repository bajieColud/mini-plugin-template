const async = require('async')
const fs = require('fs');
const less = require('less-loader');
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
  const { emitFile,resourcePath,context,rawRequest} = this
  this.cacheable(); //缓存该loader的输出
  const callback = this.async()


  let loaderCtx = this;
  let parts = parser(content,{
    filePath:resourcePath,
    mode:'dev'
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

  function getRequire (type, part, index, scoped) {
    return 'require(' +
      getRequireString(type, part, index, scoped) +
    ')'
  }

  function getRequireString (type, part, index, scoped) {
    return loaderUtils.stringifyRequest(loaderCtx,
      // ！！ 失效所有配置的loader
      '!!' +
      // 获取loader
      getLoaderString(type, part, index, scoped) +
      // 获取selector 拿到source 传给loader
      getSelectorString(type, index || 0) +
      rawRequest
    )
  }

  function getLoaderString (type, part, index, scoped) {
    var loader = getRawLoaderString(type, part, index, scoped)
    return loader
  }

  function getRawLoaderString (type, part, index, scoped) {
    var lang = part.lang || defaultLang[type]

    var styleCompiler = ''
    if (type === 'styles') {
      // style compiler that needs to be applied for all styles
      styleCompiler = styleCompilerPath + '?' + JSON.stringify({
        // a marker for vue-style-loader to know that this is an import from a vue file
        vue: true,
        id: moduleId,
        scoped: !!scoped,
        hasInlineConfig: !!query.postcss
      }) + '!'
      // normalize scss/sass if no specific loaders have been provided
      if (!loaders[lang]) {
        if (lang === 'sass') {
          lang = 'sass?indentedSyntax'
        } else if (lang === 'scss') {
          lang = 'sass'
        }
      }
    }

    var loader = options.extractCSS && type === 'styles'
      ? loaders[lang] || getCSSExtractLoader(lang)
      : loaders[lang]

    var injectString = (type === 'script' && query.inject)
      ? 'inject-loader!'
      : ''

    if (loader != null) {
      if (Array.isArray(loader)) {
        loader = stringifyLoaders(loader)
      } else if (typeof loader === 'object') {
        loader = stringifyLoaders([loader])
      }
      if (type === 'styles') {
        // add css modules
        loader = addCssModulesToLoader(loader, part, index)
        // inject rewriter before css loader for extractTextPlugin use cases
        if (rewriterInjectRE.test(loader)) {
          loader = loader.replace(rewriterInjectRE, function (m, $1) {
            return ensureBang($1) + styleCompiler
          })
        } else {
          loader = ensureBang(loader) + styleCompiler
        }
      }
      // if user defines custom loaders for html, add template compiler to it
      if (type === 'template' && loader.indexOf(defaultLoaders.html) < 0) {
        loader = defaultLoaders.html + '!' + loader
      }
      return injectString + ensureBang(loader)
    } else {
      // unknown lang, infer the loader to be used
      switch (type) {
        case 'template':
          return defaultLoaders.html + '!' + templatePreprocessorPath + '?engine=' + lang + '!'
        case 'styles':
          loader = addCssModulesToLoader(defaultLoaders.css, part, index)
          return loader + '!' + styleCompiler + ensureBang(ensureLoader(lang))
        case 'script':
          return injectString + ensureBang(ensureLoader(lang))
        default:
          loader = loaders[type]
          if (Array.isArray(loader)) {
            loader = stringifyLoaders(loader)
          }
          return ensureBang(loader + buildCustomBlockLoaderString(part.attrs))
      }
    }
  }

  // sass => sass-loader
  // sass-loader => sass-loader
  // sass?indentedSyntax!css => sass-loader?indentedSyntax!css-loader
  function ensureLoader (lang) {
    return lang.split('!').map(function (loader) {
      return loader.replace(/^([\w-]+)(\?.*)?/, function (_, name, query) {
        return (/-loader$/.test(name) ? name : (name + '-loader')) + (query || '')
      })
    }).join('!')
  }

  function getSelectorString (type, index) {
    return selectorPath +
      '?type=' + ((type === 'script' || type === 'template' || type === 'styles') ? type : 'customBlocks') +
      '&index=' + index + '!'
  }

  function ensureBang (loader) {
    if (loader.charAt(loader.length - 1) !== '!') {
      return loader + '!'
    } else {
      return loader
    }
  }

  function getCSSExtractLoader (lang) {
    var extractor
    var op = options.extractCSS
    // extractCSS option is an instance of ExtractTextPlugin
    if (typeof op.extract === 'function') {
      extractor = op
    } else {
      extractor = tryRequire('extract-text-webpack-plugin')
      if (!extractor) {
        throw new Error(
          '[vue-loader] extractCSS: true requires extract-text-webpack-plugin ' +
          'as a peer dependency.'
        )
      }
    }
    var langLoader = lang
      ? ensureBang(ensureLoader(lang))
      : ''
    return extractor.extract({
      use: 'css-loader' + cssLoaderOptions + '!' + langLoader,
      fallback: 'vue-style-loader'
    })
  }
}