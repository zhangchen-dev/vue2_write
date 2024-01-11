// 重写数组
// 1. 获取原来的数组方法
let oldArrayProtoMethods = Array.prototype;
// 2. 继承原来的方法
export const ArrayMethods = Object.create(oldArrayProtoMethods);
// 3. 劫持
let methods = ["push", "pop", "unshift", "shift", "splice"];
// 重写方法
methods.forEach((item) => {
  ArrayMethods[item] = function (...args) {
    console.log("%c 🌷🌷🌷🌷[  ]-12", "font-size:13px; background:#712d43; color:#b57187;", "数组劫持");
    // 执行本来自己的方法
    let result = oldArrayProtoMethods[item].apply(this, args);
    let inserted;
    switch (item) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.splice(2);
        break;
    }
    let ob = this.__ob__;
    if (inserted) { 
      ob.observerArrary(inserted); // 对添加的对象进行劫持
    }
    console.log('%c 🌷🌷🌷🌷[ ob.dep ]-29', 'font-size:13px; background:#02c5c5; color:#46ffff;', ob.dep);
    ob.dep.notify() // 数组的更新
    return result;
  };
});
