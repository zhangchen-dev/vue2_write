let id= 0 ;
export default class Dep {
  constructor() {
    this.id = id++
    this.subs = [];
  }
  depend() {
    // 我希望watcher可以存放dep  实现双向的记忆
    Dep.target.addDep(this)
  }
  // 收集watcher
  addSub(watcher){
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
export function pushTarget(watcher) {
  Dep.target = watcher;
}

// 取消方法
export function popTarget(watcher) {
  Dep.target = null;
}
