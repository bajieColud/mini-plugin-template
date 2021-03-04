

export const proto = Object.prototype.toString;

export const OBJECT_TAG = '[object Object]';
export const ARRAY_TAG = '[object Array]';
export const MAP_TAG = '[object Map]';
export const SET_TAG = '[object Set]';
export const SYMBOL_TAG = '[object Symbol]';
export const FUNCTION_TAG = '[object Function]';
export const DATE_TAG = '[object Date]'

export function fill(source, name, replacement) {
  const original = source[name];
  const wrapped = replacement(original);
  source[name] = wrapped;
}

export function isObject(value) {
  return proto.call(value) === OBJECT_TAG
}

export function isArray(value) {
  return proto.call(value) === ARRAY_TAG
}

export function isMap(value) {
  return proto.call(value) === MAP_TAG
}

export function isSet(value) {
  return proto.call(value) === SET_TAG
}

export function isSymbol(value) {
  return proto.call(value) === SYMBOL_TAG
}


export function isFunction(value) {
  return proto.call(value) === FUNCTION_TAG
}

export function getTag(value) {
  return proto.call(value);
}


export function  checkAsset(value,message) {
  if (!value) throw new Error(message || 'check asset');
  return;
}

export function hasKey(obj,key) {
    return typeof obj === 'object' && obj.hasOwnProperty(key)
}

export function mapKeys(source, target, map) {
  Object.keys(map).forEach((key) => {
    if (source[key]) {
      target[map[key]] = source[key];
    }
  });
}

export function isNil(value) {
  return value === undefined || value === null
}

export function proxy(
  original,
  target,
  check
  ) {
    var keys = Object.keys(target);
    keys.forEach((key)=>{
      Object.defineProperty(original,key,{
        get:function(){
          return target[key]
        },
        set:function(value) {
          if (check && check(key,value)) {
            target[key] = value;
          }
        }
      })
    })
}


export function remove (arr,item){
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Define a property.
 */
export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export function warn(...args) {
  console.warn(...args)
}

export function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function hasProto() {

}

/**
 * Check if value is primitive.
 */
export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}


/**
 * Check if val is a valid array index.
 */
export function isValidArrayIndex (val){
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}


export function parsePath (path) {
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}


export const noop = () => {}

export function getPath(){

}

// 数据间的差异性
export function diffrence(source,target,diff = {}) {
    let baseKeys = Object.keys(source);
    let targetKeys = Object.keys(target);

    // source 是小程序的data
    // target是VM的data
    targetKeys.forEach((tk)=>{
        let sourceData = source[tk];
        let targetData = target[tk];
        if (getTag(sourceData) !== getTag(targetData)) {
          diff[`${tk}`] = targetData
        }
    })
}