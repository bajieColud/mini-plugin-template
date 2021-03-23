
import {
  ARRAY_TAG,
  OBJECT_TAG,
  MAP_TAG,
  SET_TAG,
  DATE_TAG,
  proto,
  REGEXP_TAG,
  NUMBER_TAG,
  STRING_TAG,
  BOOLEAN_TAG
} from './util'


// 比较两份数据的一致性，不支持内部循环引用的数据
export default function isEqual(source,target){
    let sTag = proto.call(source);
    let tTag = proto.call(target);
    if (sTag !== tTag) return false;

    if (sTag === NUMBER_TAG || sTag === BOOLEAN_TAG || sTag === STRING_TAG) {
      return source === target
    }

    if (sTag === OBJECT_TAG) {
      let sKeys = Object.keys(source);
      let tKeys = Object.keys(target);
      if (sKeys.length !== tKeys.length) return false
      for (let key in sKeys) {
        if (!isEqual(source[key],target[key])) return false
      }
    }

    if (sTag === REGEXP_TAG) {
      return source.value === target.value
    }

    if (sTag === DATE_TAG) {
      return source.getTime() === target.getTime()
    }

    if (sTag === MAP_TAG) {
        if (source.size !== target.size) return false
       for (let [key,value] of source) {
         if (!isEqual(value,target.get(key))) return false
       }
    }

    if (sTag === ARRAY_TAG) {
      if (source.length !== target.length) return false
      for (let index in source) {
        if (!isEqual(source[index],target[index])) return false
      }
    }

    if (sTag === SET_TAG) {  
      if (source.size !== target.size) return false
      let sArr = Array.from(source)
      let tArr = Array.from(target)
      for (let index in sArr) {
        if (!isEqual(sArr[index],tArr[index])) return false
      }
    }

    return true;
}