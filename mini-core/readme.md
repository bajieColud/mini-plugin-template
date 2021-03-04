###observer数据劫持原理
```
{
  data:{
    a:1,
    userInfo:{
      name:'bajie',
      age:18,
      __ob__:{ // Observer实例
          dep:{ //Dep 实例
              subs:[
                new Watcher()
              ]
          }
      }
    },


    __ob__:{ //Observer 实例
        dep:{ Dep 实例
            subs:[ //存放 Watcher 实例
              new Watcher(),
            ]
        }
    },

  }
}
```