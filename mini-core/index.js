

import {
  fill,
  checkAsset,
  isObject,
  
} from './util'

import VM from './vm'
import handler from './handler'

function proxyVm(config) {
  fill(config,'created',(original)=>{
    return function(...args){
      this.__vmHandler = handler
      let vmProxy = new VM(this,config);
      this.__vm = vmProxy;
      this.__vm.created();
      original && original.call(this,...args)
    }
  })
}

export function sqbPage(config){
  checkAsset(isObject(config),'sqbComponent param need object !!')
  proxyVm(config);
  return Page(config)
}

export function sqbComponent(config = {}) {
  checkAsset(isObject(config),'sqbComponent param need object !!')
  proxyVm(config);
  return Component(config)
}

export function sqbApp(config) {
  return App(config)
}