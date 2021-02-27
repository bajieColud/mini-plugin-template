
let glob = require('glob')
let relative = require('relative')
let path = require('path')
let fileExt = require('./config')
let rules = require('./rule')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')
let targetPlugin  = require('../mini-webpack-plugin/target/index')
let windowChunkPlugin  = require('../mini-webpack-plugin/window/index')

let optimization = require('./optimization')
const platform = process.env.PLATFORM

const distPath = path.resolve(__dirname,`../dist/${platform}/plugin`)
const srcPath = path.resolve(__dirname,'../src/plugin');

function getEntry (rootSrc,rel) {
  var map = {};
  glob.sync(rootSrc + rel)
  .forEach(file => {
    var key = relative(rootSrc, file).replace('.sqb', '');
    map[key] = file;
  })
   return map;
}

let pluginEntry = getEntry(srcPath,'/**/index.sqb')
let entry = Object.assign({},pluginEntry)
module.exports = {
  entry,
  output:{
    path: distPath,
  },
  mode:'development',
  devtool:'inline-source-map',
  target:targetPlugin,
  resolve:{
    extensions: ['.sqb','.js','.json'],
    alias:{
      "@":path.resolve(__dirname,'../src')
    }
  },
  optimization,
  module:{
    rules:rules
  },

  plugins:[
    new ExtractTextPlugin({
      filename: "[name].wxss",
    }),

    new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, `../config/plugin.json`),
          to:`${distPath}`
        }, 
      ]),
  ]

}