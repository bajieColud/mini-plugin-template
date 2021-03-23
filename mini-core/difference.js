import {
  ARRAY_TAG,
  OBJECT_TAG,
  MAP_TAG,
  SET_TAG,
  DATE_TAG,
  proto,
  REGEXP_TAG,
  NULL_TAG,
  STRING_TAG,
  BOOLEAN_TAG,
  NUMBER_TAG
} from './util'

// 找出数据间的差异性
// 使用动态规划方法，将大业务拆分成小业务，再进行合并


/**
 * source:{
 *  a:3,
 *  b:{f:5}
 * },
 * target:{
 * a:4
 * }
 * 
 * target[`a`] = 3;
 * target[`b`] = {f:5}
 * target[`c[0]['name']`] = 'bajie'
 * 
 * path = 
 */
function objectDifference(source,target,path,currentKey) {
  let sKeys = Object.keys(source);
  let tKeys = Object.keys(target);
  let keys = new Set(sKeys.concat(tKeys));

  for(let key of keys) {
    difference(source[key],target[key],path,currentKey?`${currentKey}[${key}]`:key)
  }
 
}

function arrayDifference(source,target,path,currentKey) {
  let sLen = source.length;
  let tLen = target.length;
  for (let i = 0; i < sLen || i < tLen ; i++) {
    difference(source[i],target[i],path,`${currentKey}[${i}]`)
  }

}


export default function difference(source,target,path = {},currentKey) {
    let sTag = proto.call(source);
    let tTag = proto.call(target);

    path = path || [];
    currentKey = currentKey || ''
    if (sTag !== tTag) {
      return path[currentKey] = target;
    } 

    if (sTag === NUMBER_TAG || sTag === STRING_TAG || sTag === BOOLEAN_TAG || sTag === NULL_TAG) {
      if (source !== target) {
        return path[currentKey] = target;
      }
    }

    if (sTag === ARRAY_TAG) {
        return arrayDifference(source,target,path,currentKey);
    }

    if (sTag === OBJECT_TAG) {
      return objectDifference(source,target,path,currentKey)
    }


    //小程序的setdata无法对map 和set进行深入的设置，比如list[0]['name']='bajie',
    // 所以这里比较是否里面的内容深度相等，不等则进行引用赋值

    if (sTag === MAP_TAG || sTag === SET_TAG) { 
      return 
    }

    
}
