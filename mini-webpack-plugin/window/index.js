let fs = require('fs');
const pluginName = 'windowChunkPlugin';
class windowChunkPlugin {
    apply(compiler){
        compiler.hooks.done.tap(pluginName, (stats)=>{
          let outputOptions = stats.compilation.outputOptions;
          const distPath = outputOptions.path;
          let globalObject = outputOptions.globalObject;

          let content = `let ${globalObject} = {};\n
          module.exports = ${globalObject}`
          console.log('####content is ',content,`${distPath}/window.js`)
          fs.writeFile(`${distPath}/window.js`,content,(err)=>{
            console.log('err');
          })
        })
    }
}

module.exports = windowChunkPlugin