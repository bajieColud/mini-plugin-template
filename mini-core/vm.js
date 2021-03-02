
import deepClone from './deepClone'
import {
  proxy
} from './util'

export default class VM{
    constructor(context,options) {
      this.context = context; //component,page,app
      this.options = options;
      this.initied = false; 
    }


    // vm所有的重要信息全在这里进行初始化
    created(){
     if (this.initied) return;
     this.initData();

     this.initied = true;
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