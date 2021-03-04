

import {
  ARRAY_TAG,
  OBJECT_TAG,
  MAP_TAG,
  SET_TAG,
  DATE_TAG,
  proto,
  REGEXP_TAG
} from './util'


export default function deepClone(value,stack) {

  if (!value) return value;
  if (typeof value !== 'object') return value; //1、不是基本的object对象，object,array,map,set Date。其余对象 function symbol 

  let tag = proto.call(value);
  let result
  if (tag === DATE_TAG) {
      result = new Date(value)
  }else if (tag === REGEXP_TAG) {
    result = new regexp.constructor(value.source, value.flags)
    result.lastIndex = regexp.lastIndex
  }else if (typeof value.constructor === 'object'){
    result = new value.constructor();
  }else {
    result = {}
  }
   
  // 引入一个map ，解决循环引用的问题
  stack = stack || new Map();
  const stacked = stack.get(value)
  if (stacked) {
    return stacked
  }
  stack.set(value,result)

  switch(tag) {
    case OBJECT_TAG:{
       for (var key in value) {
         result[key] = deepClone(value[key],stack);
       }
       break;
    }

    case ARRAY_TAG:{
      value.forEach(element => {
        result.push(deepClone(element,stack))
      });
      break;
    }

    case MAP_TAG:{
      //map.set(key,value)
      //map.get(key)
      //map.foreach
      value.forEach((val,key)=>{
        result.set(key,deepClone(val,stack))
      })
      
      break;
    }

    case SET_TAG:{
      value.forEach((val)=>{
        result.add(deepClone(val,stack))
      })
      break;
    }

  }
  

  // 系统的object类型的遍历了一遍，如果没有的话，抛出错误，及时补上
  if (!result) {
      throw new Error(`value ${value} type is not get ,fuck fuck !!, what is the type? ${tag}`)
  }

  return result;
}