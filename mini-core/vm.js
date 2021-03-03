
import deepClone from './deepClone'
import { observe } from './observe';
import {
  proxy
} from './util'
import Watcher from './watcher';

export default class VM{
    constructor(context,options) {
      this.context = context; //component,page,app
      this.options = options;
      this.hasInit = false; 
      this.__renderWacther = null;
      this.watchers = []; // watcher list for 
    }


    // vm created,initdata,watch,computed now 
    created(){
      if (this.hasInit) return;
      this.initData();
      this.hasInit = true;
    }

    initData(){
      let data = this.context.__vmHandler.__getInitData.call(this.context,this.options);
      this.data = deepClone(data); // clone 一份 互不想干
      proxy(this.context,this.data,(key,value) => {
        console.log('######proxy data is ',key,value)
        return true;
      })
      observe(this.data); // init observer for vm data
    }

    // init watcher ,add in ob.dep. when data change , notify here
    initRender(){
      this.__renderWacther = new Watcher(this,()=>{
        
      },{},true)
    }




    
} 