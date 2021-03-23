import { mixin } from "lodash";


const proto = Object.prototype.toString;

const OBJECT_TAG = '[object Object]';
const ARRAY_TAG = '[object Array]';
const MAP_TAG = '[object Map]';
const SET_TAG = '[object Set]';
const SYMBOL_TAG = '[object Symbol]';
const FUNCTION_TAG = '[object Function]';
const DATE_TAG = '[object Date]';
const REGEXP_TAG = '[object RegExp]'

const Number_TAG = '[object Number]'
const String_TAG = '[object String]'
const Boolean_TAG = '[object Boolean]'
const NULL_TAG = '[object Null]'

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

  let key;
  while(sKeys.length || tKeys.length) {
    key = sKeys.length ? sKeys.shift() : tKeys.shift()
    difference(source[key],target[key],path,currentKey?`${currentKey}[${key}]`:key)
  }
 
}

function arrayDifference(source,target,path,currentKey) {
  let sLen = source.length;
  let tLen = target.length;
  for (let i = 0; i < sLen || i < tLen ; i++) {
    difference(source[i],target[i],path,currentKey?`${currentKey}[${key}]`:key)
  }

}

function mapDifference(source,target,path,currentKey) {



}

export default function difference(source,target,path,currentKey) {
    let sTag = proto.call(source);
    let tTag = proto.call(target);

    path = path || [];
    currentKey = currentKey || ''
    if (sTag !== tTag) {
      return path.push([currentKey,target])
    } 

    if (sTag === Number_TAG || sTag === String_TAG || sTag === Boolean_TAG || sTag === NULL_TAG) {
      if (source !== target) {
        return path.push([currentKey,target])
      }
    }

    if (sTag === ARRAY_TAG) {
        return arrayDifference(source,target,path,currentKey);
    }

    if (sTag === OBJECT_TAG) {
      return objectDifference(source,target,path,currentKey)
    }

    if (sTag === MAP_TAG) {
      return 
    }

    
}
