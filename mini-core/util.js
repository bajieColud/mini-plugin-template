

const proto = Object.prototype.toString;

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


export function  checkAsset(value,message) {
  if (!value) throw new Error(message || 'check asset');
  return;
}

export function hasKey(obj,key) {
    return typeof obj === 'object' && obj.hasOwnProperty(key)
}