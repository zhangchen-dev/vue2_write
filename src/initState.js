import { observer } from "./observer/index.js";
import Watcher from "./observer/watcher.js";
import { nextTick } from "./utils/nextTick.js";

// 初始化数据
export function initState(vm) {
  let opts = vm.$options;
  // 判断
  // if (opts.props) {
  //   initPorps();
  // }
  if (opts.data) {
    initData(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
  // if (opts.computed) {
  //   initComputed();
  // }
  // if (opts.methods) {
  //   initMethods();
  // }
}

// vue2对data初始化 （）
function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? data.call(vm) : data; // 改变this的指向
  // data数据进行劫持 此处返回的一定是个对象形式的data

  // 将data上的所有属性代理到实力上 是的可以使用 this.xx = newvalue触发劫持
  for (let key in data) {
    proxy(vm, "_data", key);
  }
  observer(data);
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}

// 初始化watch
function initWatch(vm) {
  let watch = vm.$options.watch;
  // 可以监听多个 需要遍历
  for (let key in watch) {
    // 获取到属性对应的值
    let handler = watch[key]; // 数组 对象 字符串 函数
    if (Array.isArray(handler)) {
      handler.forEach((item) => createWatcher(vm, key, item));
    } else {
      // 创建一个方法来处理
      createWatcher(vm, key, handler);
    }
  }
}

export function stateMixin(vm) {
  // 队列 这个nextTick 和 util中的是一个 此处需要合并成一个 nextTick时机 : 数据更新之后获取到最新的Dom
  vm.prototype.$nextTick = function (cb) {
    nextTick(cb);
  };
  // 添加watch方法
  vm.prototype.$watch = function (vm, exprOrfn, handler, options) {
    // 实现watch 使用Watcher类实现 区别： 渲染 走渲染的watcher $watch走watcher 标识 user的boolean值
    let watcher = new Watcher(vm, exprOrfn, handler, (options = { ...options, user: true })); // 此处添加用于区分 此处是用户的watcher
    if (options.immediate) {
      handler.call(vm); // 立即执行
    }
  };
}

// vm.$watch(()=>{return 'a'}) // 返回watch上的属性 要兼容这种用法 watch上还有用来标识是初次渲染的 还是用户用来添加监听的标识 options中保存了这些属性
function createWatcher(vm, exprOrfn, handler, options) {
  // 处理handler
  if (typeof handler === "object") {
    options = handler; // 用户的配置项 deep 等
    handler = handler.handler; // 这里就决定了watch中添加的那个方法名字必须是handler的原因 在这里直接取用这个属性值的
  } else if (typeof handler === "string") {
    handler = vm[handler]; // 将实例上的方法取用
  }
  // watch的最终处理 $watch 这个方法
  return vm.$watch(vm, exprOrfn, handler, options);
}
