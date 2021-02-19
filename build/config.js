
let platform = process.env.PLATFORM;
var fileExtList = {
  'wx':{
    'template':'.wxml',
    'wxs':'.wxs',
    'css':'.acss',
    'platform':'wx',
    'json':'.json'
  },
  "my":{
    'template':'.axml',
    'wxs':'.sjs',
    'css':'.wxss',
    'platform':'my',
    'json':'.json'
  }
}

let fileExt = fileExtList[platform]

module.exports = fileExt;