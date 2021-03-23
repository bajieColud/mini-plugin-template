
import {
  hasKey
} from './util'


// 微信相关的
let handler = {
  __getInitData(config) {
    let ret = {};
    let data = config.data || {}
    let keys = Object.keys(data);
    keys.forEach((key)=>{
      if (hasKey(this.data,key)) {
          ret[key] = this.data[key]
      }
    })
    return ret; 
  },

  __getInitProps(config) {
    let ret = {};
    let props = config.props || {}
    let keys = Object.keys(props);
    keys.forEach((key)=>{
      if (hasKey(this.data,key)) {
          ret[key] = this.data[key]
      }
    })
    return ret; 
  }
}

export default handler