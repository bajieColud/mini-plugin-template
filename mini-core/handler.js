
import {
  hasKey
} from './util'

let handler = {
  __getInitData() {
    let ret = {};
    let data = config.data || {}
    let keys = Object.keys(data);
    keys.forEach((key)=>{
      if (hasKey(this.data,key)) {
          ret[key] = this.data[key]
      }
    })
    return ret; 
  }
}

export default handler