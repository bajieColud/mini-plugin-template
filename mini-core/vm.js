
import deepClone from './deepClone'
import { observe } from './observe';
import {
  proxy,
  noop,
  diffrence,
  fill
} from './util'
import Watcher from './watcher';

export default class VM{
    constructor(context,options) {
      this.__sqbContext = context; //component,page,app
      this.__sqbOptions = options;
      this.__sqbHasInit = false; 
    }


    // vm created,initdata,watch,computed now 
    created(){
      if (this.__sqbHasInit) return;
      this.initData();
      this.initWatch();
      this.proxySetData();
      this.initRender();
      this.__sqbHasInit = true;
    }



    initData(){
      let data =  this.__sqbContext.__vmHandler.__getInitData.call(this.__sqbContext,this.__sqbOptions);
      let props = this.__sqbContext.__vmHandler.__getInitProps.call(this.__sqbContext,this.__sqbOptions);
      this.data = Object.assign({},deepClone(data),deepClone(props)); // clone 一份 互不相干
      proxy(this.__sqbContext.data,this.data,(key)=> {
        if (key in props) {
          throw new Error(`props ${key} can not set !! what are you doing ???`)
        }
      }) ; //访问组件的this.data。 访问到vm的data，如果设置的为props，则进行报错
      observe(this.data); // init observer for vm data


    }

    initWatch () {
      let watch = options.watch;
      let expression = (key)=>{
        const segments = key.split(/\s+,\s/).split('.')
        let obj = this.data;
        return function () {
          for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
          }
          return obj
        }
      }
      if (watch) {
        for (const key in watch) {
          const handler = watch[key]
          if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
              this.watch(expression(key), handler[i])
            }
          } else {
            this.watch(expression(key), handler)
          }
        }
      }
    }

    watch (expOrFn, cb, options) {
      return watch(this, expOrFn, cb, options)
    }


    // 创建数据的watcher
    initRender(){
      new Watcher(this,()=>{
        this.__render();
      })
    }
    

    /** */
    vmSetData(param,cb) {

    }

    proxySetData(){
      let self = this;
      this.__sqbRawSetData = this.__sqbContext.vmSetData;
      Object.defineProperty(this.__sqbContext,'setData',{
        get:function(){
          return self.vmSetData
        },
      })
    }

    // this.data改变后，
    __render(){
        let vmData = this.data;
        let cpData = this.__sqbRawSetData.data;
        
    }

    // 将vm 的data和组件的data进行比较，进行最小化的setData
    render(param,cb){

      this.__sqbRawSetData(param,cb)
    }
} 