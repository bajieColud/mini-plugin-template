
import deepClone from './deepClone'
import {
  proxy
} from './util'

export default class VM{
    constructor(context,options) {
      this.context = context; //component,page,app
      this.options = options;
      this.hasInit = false; 
      this.watchers = []; // 多少监听者
    }


    // vm所有的重要信息全在这里进行初始化
    created(){
     if (this.hasInit) return;
     this.initData();

     this.hasInit = true;
    }

    initData(){
      let data = this.context.__vmHandler.__getInitData.call(this.context,this.options);
      this.data = deepClone(data);
      proxy(this.context,this.data,(key,value) => {
        console.log('########key is ',key,value);
        return true;
      })
    }
} 