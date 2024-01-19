export function renderMixin(Vue) {
  // 添加处理标签的三个方法
  // 标签
  Vue.prototype._c = function () {
    // 标签
    return createElement(this, ...arguments);
  };
  Vue.prototype._v = function (text) {
    // 文本
    return createText(text);
  };
  Vue.prototype._s = function (val) {
    // 变量
    return val === null ? "" : typeof val === "object" ? JSON.stringify(val) : val;
  };
  // 将render函数变成vnode
  Vue.prototype._render = function () {
    let vm = this;
    let render = vm.$options.render;
    let vnode = render?.call(this);
    return vnode;
  };
}

// 创建元素的方法
function createElement(vm, tag, data = {}, ...children) {
  // 注意，此处还需要能够创建组件
  // 判断
  if (isReservd(tag)) {
    return vnode(vm, tag, data, data.key, children);
  } else {
    // 是组件
    const Ctor = vm.$options["components"][tag]; // 获取到自己的组件
    return Createcomponent(vm, tag, data, children, Ctor);
  }
}

function isReservd(tag) {
  return ["a", "div", "h2", "h3", "span", "input"].includes(tag);
}

// 创建组件成虚拟节点
function Createcomponent(vm, tag, data, children, Ctor) {
  if (typeof Ctor === "object") {
    Ctor = vm.constructor.extend(Ctor);
    console.log('%c 🌷🌷🌷🌷[ Ctor ]-46', 'font-size:13px; background:#5d1a0d; color:#a15e51;', Ctor)
  }
  // 添加一个方法 hooks
  data.hooks = {
    init(vnode) {
      // 组件的初始化
      // 初始化子组件 创建实例
      let child = (vnode.componentInstance = new vnode.componentOptions.Ctor({}));
      child.$mount();
    },
  };
  const aa =  vnode("vm", "vue-component" + "-" + tag, data, undefined, undefined, undefined, { Ctor, children });
  return aa
}

// 创建文本
function createText(text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

// vnode
/**
 * 虚拟dom js 对象 只可以描述节点
 * {
 * tag,
 * text,
 * children
 * }
 */
// 创建虚拟dom
function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  };
}
