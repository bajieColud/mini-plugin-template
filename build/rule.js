
const path = require('path')
let fileExt = require('./config')
module.exports = [
  {
    test:/\.sqb$/,
    use:[
    {
      loader:path.resolve(__dirname,'../mini-webpack-loader/loader.js'),
      options:{
        fileExt,
        loaderContext:path.resolve(__dirname,'../mini-webpack-loader')
      }
    }]
  }
]