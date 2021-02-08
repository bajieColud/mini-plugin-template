
let platform = process.env.PLATFORM;
var fileExtList = {
  'wx':{
    'template':'.wxml',
    'wxs':'.wxs',
    'css':'.acss'
  },
  "my":{
    'template':'.axml',
    'wxs':'.sjs',
    'css':'.wxss'
  }
}

let fileExt = fileExtList[platform]

module.exports = fileExt;