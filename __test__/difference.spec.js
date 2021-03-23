
import difference from '../mini-core/difference'

test('test object data',()=>{
  let source = {
    name:'baJie',
    age:12
  }
  let target = {
    name:'xukaiJie'
  }
  let res = [['name','xukaiJie'],['age',undefined]]
  let path = []
  difference(source,target,path)
  console.log('#####path is ',path)
  expect(path).toEqual(res);
})

