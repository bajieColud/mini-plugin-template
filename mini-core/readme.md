###observer数据劫持原理
```
{
  data:{
    a:1,
    __ob__:{ //Observer 实例
        dep:{Dep 实例
            subs:[ //存放 Watcher 实例
              new Watcher(),
            ]
        }
    }
  }
}
```