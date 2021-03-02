
import deepClone from './deepClone'

export default class VM{
    constructor(context,options) {
      this.context = context; //component,page,app
      this.options = options;
    }


    // vm所有的重要信息全在这里进行初始化
    created(){
     this.initData();


    }

    initData(){
      let data = this.context.__vmHandler.__getInitData.call(this.context);
      console.log('#######get init data is ',data);
      this.data = deepClone(data);
    }
} 