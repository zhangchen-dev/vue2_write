export function renderMixin(Vue) {
  // 添加处理标签的三个方法
  // 标签
  Vue.prototype._c = function () {
    // 标签
    return createElement(...arguments);
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
    let vnode = render.call(this);
    return vnode;
  };
}

// 创建元素的方法
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children);
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
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text,
  };
}
