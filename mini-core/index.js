

import {
  fill,
  checkAsset,
  isObject,
  mapKeys
} from './util'

import VM from './vm'
import handler from './handler'

const pageMapLifetimes = {
  'data':'data',
  'created':'onLoad',
  'show':'onShow',
  'destroy':'onUnload',
  'hide':'onHide',
  'mounted':'onReady'
}


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
  let sqbConfig = {}
  proxyVm(config);
  mapKeys(config,sqbConfig,pageMapLifetimes)
  return Page(sqbConfig)
}

export function sqbComponent(config = {}) {
  checkAsset(isObject(config),'sqbComponent param need object !!')
  proxyVm(config);
  return Component(config)
}

export function sqbApp(config) {
  return App(config)
}