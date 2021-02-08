
// 摘自webpack/lib/web

const JsonpTemplatePlugin = require("./JsonpTemplatePlugin");

// 下面plugin 没做任何修改，只是从webpack那边重新引用下
const NodeSourcePlugin = require("webpack/lib/node/NodeSourcePlugin");
const FunctionModulePlugin = require("webpack/lib/FunctionModulePlugin");
const LoaderTargetPlugin = require("webpack/lib/LoaderTargetPlugin");

module.exports = function (compiler) {
  const { options } = compiler
  compiler.apply(
    new JsonpTemplatePlugin(options.output),
    new FunctionModulePlugin(options.output),
    new NodeSourcePlugin(options.node),
    new LoaderTargetPlugin(options.target)
  );
};
