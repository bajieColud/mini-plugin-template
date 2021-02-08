var parser = require('./parser');
module.exports = function(content) {
  console.log('#####is ',content,this)
  let output = parser(content);
}