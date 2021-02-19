
const babel = require('@babel/core');


function babelPlugin() {
  return {
    name: 'components index.json plugin',
    visitor: {
      ObjectProperty(path,source) {
        let platformList = [
          'wx',
          'my'
        ]
        const { opts: { fileExt:{
          platform
         }} } = source;
        const node = path.node;
        if (node.key.value === platform) {
          const properties = node.value.properties;
          properties.forEach((n) => {
            path.insertAfter(n);
          });

          path.remove();
        } else if (platformList.indexOf(node.key.value) !== -1) {
          path.remove();
        }
      },
    },
  };
}

// 对json文件处理
module.exports = function (source,{fileExt}) {
  let code = `let __sqb = ${source};module.exports =__sqb`;
  let output = babel.transformSync(code, {
    ast: true,
    plugins: [[babelPlugin,{fileExt}]],
  }).code;
  const starIndex = output.indexOf('{');
  const lastIndex = output.lastIndexOf('}');

  output = output.substring(starIndex, lastIndex + 1);
  return output;
}