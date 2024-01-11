import { compileToFunction } from "./compile/index";
import { initState } from "./initState";
import { callHook, mountComponent } from "./lifecycle";
import { mergeOptions } from "./utils/util";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    let vm = this;
    // vm.$options = options
    vm.$options = mergeOptions(Vue.options, options);
    // 调用生命周期 beforeCreated
    callHook(vm, "beforeCreated");
    // 初始化状态
    initState(vm);
    // 调用生命周期 created
    callHook(vm, "created");

    // 渲染模板（模板编译） el是必须有的才能渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
  // 创建mount函数
  Vue.prototype.$mount = function (el) {
    // el <=template <=render 此处先后顺序可以参考生命周期图
    let vm = this;
    el = document.querySelector(el); // 获取元素
    vm.$el = el; // 旧的dom保存下
    let options = vm.$options;
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        // 获取html
        el = el.outerHTML;
        // 变成ast语法树 获取返回的render函数
        let render = compileToFunction(el);
        // 1. 将render函数变成Vnode 2. Vnode 变成真实的Dom 放到页面上去
        options.render = render;
      }
    }
    // 挂载组件
    mountComponent(vm, el);
  };
}
