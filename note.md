
# 面试问题
### vue的渲染流程
  vue的渲染流程 => 数据初始化 =》 对模板进行编译 =》 变成render函数(ast语法树等) =》render 函数变成vnode =>vnode变成真实dom放到页面 渲染完成

# vue的生命周期
    - 实现
    vue.mixin({}) 混入方法 (是一个全局的方法)
    - 设计模式
    订阅发布模式

#### dep和watcher
- 其中dep是在数据劫持中实现每个属性都添加dep，收集依赖的
- watcher的触发是在生命周期中的，也即更新位置处的生命周期触发 触发也就是在哪里劫持的set方法就在哪里触发

- `let getter = typeof userDef === "function" ? userDef : userDef.get;
    // 使用watcher实现dirty (缓存机制)
    let watcher = (vm._computedWatchers = {}); 
    // 给计算属性中的每个属性添加一个watcher
    watcher[key] = new Watcher(vm, getter, () => {}, { lazy: true }); // 计算属性中的watcher  lazy不触发方法
    `
- 上述代码能够实现的原因：因为watcher赋值和vm.__computedWatchers指向同一个对象，所以当使用watcher【key】赋值时候，相当于获取到对象进行赋值，而这个对象被两个变量引用指向，所以可以获取到；
