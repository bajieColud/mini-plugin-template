
import deepClone from './deepClone'
import { observe } from './observe';
import {
  proxy,
  noop,
  diffrence
} from './util'
import Watcher from './watcher';

export default class VM{
    constructor(context,options) {
      this.context = context; //component,page,app
      this.options = options;
      this.hasInit = false; 
      this.__renderWatcher = null;
      this._watchers = []; // watcher list for 
    }


    // vm created,initdata,watch,computed now 
    created(){
      if (this.hasInit) return;
      this.initData();
      this.initRender(); // 创建render watcher 
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
      this.__renderWatcher = new Watcher(this,() => {
        this.render();
      },noop)
    }

    render(){
      const renderData = this.data; // vm中的data
      const appData = this.context.data; // 小程序里的data
      // 进行严格比较，提取差异点，进行渲染
      const diff = diffrence(appData,renderData)
    }




    
} 