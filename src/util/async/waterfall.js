


function isGreeting(value) {
  return /^h(?:i|ello)$/.test(value)
}

function customizer(objValue, othValue) {
  if (isGreeting(objValue) && isGreeting(othValue)) {
       return true
  }
}

 const array = ['hello', 'goodbye']
 const other = ['hi', 'goodbye']

 isEqualWidth(array,other)

function isEqualWidth(value,other,customizer) {
  customizer = typeof customizer === 'function' ? customizer : undefined
  const result = customizer ? customizer(value, other) : undefined
  console.log('########result is ',result);
}



// function cb() {
//   console.log('#######cb args is ',arguments);
// }

// console.log('###########3,toStringTag',cb[Symbol.toStringTag]);


// waterfall([
//   (callback) => {
//     callback();
//   },
//   (callback) => {
//     callback()
//   },
//   (callback) => {
//     callback()
//   }
// ],cb)


// function waterfall(task,callback) {
//     if (Object.prototype.toString.call(task) !== "[object Array]") {
//       throw error('task must array type')
//     }

//     function next(...args){
//       if (!task.length) return callback.call(null,...args);
//       let fn = task.shift();
//       fn.call(null,...args,onlyOnce(next))
//     }
//     next();
// }

// function onlyOnce(fn) {
//   let called = false;
//   if (called) throw error('callback only called once');

//   return function (...args) {
//     called = true
//     return fn.call(null,...args);
//   }
// }