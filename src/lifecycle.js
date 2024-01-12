import { patch } from "./Vnode/patch";
import watcher from "./observer/watcher";

export function mountComponent(vm, el) {
  callHook(vm, "beforeMounted");
  // 1.000000
  // 源码的两个方法
  // 这个函数的执行时机 在初次使用时候他还未被注册到原型链上但是后续会执行，这个添加了函数执行机制？？？
  // console.log(vm);

  // 2.00000 实现自动更新触发
  // 重写updata方法
  let updataComponent = () => {
    // console.log('updata')
    vm._updata(vm._render());
  };
  //参数： 实例对象 更新函数 回调函数 标识
  new watcher(vm, updataComponent, () => {
    // 执行完视图更新 后执行生命周期updated
    callHook(vm,'updated')
  }, true);
  // vm._updata(vm._render()); // render函数作用 将render函数变成vnode 2, vm._updata vnode=》真实dom
  // console.log(vm._updata, vm._render);
  callHook(vm, "mounted");
}

// 这个方法只是注册方法到原型链上
export function lifecycleMixin(Vue) {
  Vue.prototype._updata = function (vnode) {
    // vnode => 真实的dom
    let vm = this;
    // 对比更新dom
    // 需要区分是首次渲染还是更新
    let prevVnode = vm._Vnode // 如果是首次渲染 值为null
    if(!prevVnode){
      vm.$el = patch(vm.$el, vnode);
      vm._Vnode = vnode // 首次执行完成后赋值
    }else{
      patch(vm.$el,vnode)
    }
  };
}
// 生命周期的调用
export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers && handlers.length) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(this); // 改变生命周期中的指向
    }
  }
}
