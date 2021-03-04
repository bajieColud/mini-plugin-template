function getTag(value) {
  return Object.prototype.toString.call(value)
}


var origin = {
    a:3
}

var target = {
    b:4
}
// 数据间的差异性
function diffrence(source,target,diff = {}) {
  
  let sourceTag = getTag(source);
  let targetTag = getTag(target);



  let baseKeys = Object.keys(source);
  let targetKeys = Object.keys(target);

  // source 是小程序的data
  // target是VM的data
  for (var i = 0; i < targetKeys.length;i++) {
      const key = targetKeys[i];
      let sourceData = source[key];
      let targetData = target[key];
      if (getTag(sourceData) !== getTag(targetData)) {
        diff[`${tk}`] = targetData
        continue;
      }


  }

  return diff;
}

let diff = diffrence(origin,target);

console.log('######diff is ',diff);