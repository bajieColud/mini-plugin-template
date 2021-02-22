
let glob = require('glob')
let relative = require('relative')
let path = require('path')
let fileExt = require('./config')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')
let targetPlugin  = require('../mini-webpack-plugin/target/index')
let windowChunkPlugin  = require('../mini-webpack-plugin/window/index')

let optimization = require('./optimization')
const platform = process.env.PLATFORM

const distPath = path.resolve(__dirname,`../dist/${platform}/miniprogram`)
const srcPath = path.resolve(__dirname,'../src/miniprogram');

function getEntry (rootSrc,rel) {
  var map = {};
  glob.sync(rootSrc + rel)
  .forEach(file => {
    var key = relative(rootSrc, file).replace('.sqb', '');
    map[key] = file;
  })
   return map;
}

let pageEntry = getEntry(srcPath,'/**/index.sqb')
let appEntry = getEntry(srcPath,'/app.sqb')

let entry = Object.assign({},appEntry,pageEntry)
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
    }),

    new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, `../config/${fileExt.project}`),
          to:`${distPath}/..`
        }, 
        {
          from: path.resolve(__dirname, `../config/sitemap.json`),
          to:`${distPath}`
        }, 
      ]),
    
    new windowChunkPlugin()
  ]

}