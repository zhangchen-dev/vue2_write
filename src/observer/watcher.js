//  1 通过创建wacher类 实现更新

import { nextTick } from "../utils/nextTick";
import { popTarget, pushTarget } from "./dep";

//参数： 实例对象 更新函数 回调函数 标识watcher是否是用来渲染的？？？
let id = 0;
export default class Watcher {
  constructor(vm, exprOrfn, cb, options) {
    this.vm = vm;
    this.exprOrfn = exprOrfn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = [];
    this.user = !!options.user;
    this.depsId = new Set(); // 去重dep
    // 判断
    if (typeof exprOrfn === "function") {
      this.getter = exprOrfn; // 用来更新视图的方法
    } else {
      // {a,b,c} watch的定义使用 将会是字符串
      this.getter = function () {
        let path = exprOrfn.split(".");
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj;
      };
    }
    // 执行页面渲染的get 此处获取到的是旧的值
    this.value = this.get(); // 保存监听的初始值 watch oldValue
    // 触发更新视图方法
    this.get();
  }
  // 初次渲染
  get() {
    // 添加watcher
    pushTarget(this);
    const value = this.getter();
    // 更行后取消
    popTarget();
    return value;
  }
  // 更新
  updata() {
    // 实现统一更新，不要每次数据变化触发更新
    // 思路：暂存
    // console.log("updata"); // 执行次数和set触发次数一致
    // this.getter();
    queueWatcher(this);
  }
  run() {
    // 数据改变才会执行run
    // console.log("run"); //一个时钟周期只执行一次
    let value = this.get();
    let oldValue = this.value;
    this.value = value; // 新的值覆盖旧值
    // 执行handler 是否使用户的watcher
    if (this.user) {
      this.cb.call(this.vm, value, oldValue);
    }
  }

  addDep(dep) {
    // 去重
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this);
    }
  }
}

// 收集依赖 vue中 dep wathcer dep和wdata中的属性是一一对应的
// watcher 在视图上用力几个就有几个watcher
// 先实现： dep与watcher 一对多的关系

let queue = []; // 将需要批量更新 数据放到队列中
let has = {};
let pending = false;
function flushWatcher() {
  queue.forEach((item) => item.run());
  queue = [];
  has = {};
  pending = false;
}

function queueWatcher(watcher) {
  let id = watcher.id; // 更新的时候同一个需要更新的字段的id是一样的
  // 防抖思路 用户触发多次 只触发一次
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;
    // 添加异步 调整执行顺序 异步在同步之后
    if (!pending) {
      // 不要使用定时器 使用nextTick 异步
      //   setTimeout(() => {
      //     queue.forEach((item) => item.run());
      //     queue = [];
      //     has = {};
      //     pending = false;
      //   }, 0);

      nextTick(flushWatcher); // 上面注释代码使用这个函数实现
    }
    pending = true;
  }
}
