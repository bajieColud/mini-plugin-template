
let glob = require('glob')
let relative = require('relative')
let path = require('path')
let fileExt = require('./config')
let ExtractTextPlugin = require('extract-text-webpack-plugin')


let optimization = require('./optimization')
const platform = process.env.PLATFORM

const distPath = path.resolve(__dirname,`../dist/${platform}`)
const srcPath = path.resolve(__dirname,'../src');

function getEntry (rootSrc,rel) {
  var map = {};
  glob.sync(rootSrc + rel)
  .forEach(file => {
    var key = relative(rootSrc, file).replace('.js', '');
    map[key] = file;
  })
   return map;
}

let pageEntry = getEntry(srcPath,'/miniprogram/**/index.js')
let pluginEntry = getEntry(srcPath,'/plugins/**/index.js')
let appEntry = getEntry(srcPath,'/miniprogram/app.js')

let entry = Object.assign({},pageEntry,appEntry)
module.exports = {
  entry,
  output:{
    path: distPath,
  },
  mode:'development',
  devtool:'inline-source-map',

  resolve:{
    extensions: ['.sqb','.js','.json'],
    alias:{
      "@":path.resolve(__dirname,'../src')
    }
  },
  optimization,
  module:{
    rules:[
      {
        test:/\.sqb$/,
        use:[
        {
          loader:path.resolve(__dirname,'../mini-webpack-loader/loader.js'),
          options:{
            fileExt
          }
        }]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "less-loader"
            }],
        })
     }
    ]
  },

  plugins:[
    new ExtractTextPlugin({
      filename: "[name].wxss",
    })
  ]

}