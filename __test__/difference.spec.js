
import difference from '../mini-core/difference'

test('test object data',()=>{
  let source = {
    name:'baJie',
    age:12,
    list:[{
      name:'jamesd'
    }]
  }
  let target = {
    name:'xukaiJie',
    item:{
      a:3
    },
    list:[{
      name:'james'
    }]
  }
  let res = {
    name:'xukaiJie',
    item:{
      a:3
    },
    "list[0][name]":"james",
    age:undefined
  }
  let path = {}
  difference(source,target,path)
  console.log('###path is ',path)
  expect(path).toEqual(res);
})

