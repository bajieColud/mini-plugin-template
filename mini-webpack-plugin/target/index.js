
// 摘自webpack/lib/web

const JsonpTemplatePlugin = require("./JsonpTemplatePlugin");

// 下面plugin webpack那边拷贝，对chunk 和 main 的template进行了简单的修饰
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
