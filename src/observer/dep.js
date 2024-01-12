let id = 0;
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    // 我希望watcher可以存放dep  实现双向的记忆
    Dep.target.addDep(this);
  }
  // 收集watcher
  addSub(watcher) {
    this.subs.push(Dep.target);
  }
  // 更新  watcher
  notify() {
    this.subs.forEach((watcher) => {
      watcher.updata();
    });
  }
}

// 添加watcher
Dep.target = null;

// 处理多种类的watcher
let stack = []; // 栈
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher); // 渲染watcher 其他的watcher
}

// 取消方法
export function popTarget(watcher) {
  // Dep.target = null;
  // 解析完成一个watcher就删除一个
  stack.pop();
  Dep.target = stack[stack.length - 1]; // 获取到前一个watcher
}
