var parser = require('./parser');
module.exports = function(content) {
  const filePath = this.resourcePath;
  let output = parser(content,{
    filePath,
    mode:'dev'
  });

  console.log('#####output is ',output)
  return 'let a = 3;\n export default a';
}