export function patch(oldVnode, Vnode) {
  // 将vnode 变成真实的dom
  //1. 创建新的dom
  let el = createEl(Vnode);
  //2. 替换  获取父节点=》插入=》老元素删除
  let parentEl = oldVnode.parentNode // body
  parentEl.insertBefore(el,oldVnode.nextsibling)
  parentEl.removeChild(oldVnode)
  return el
}
// 创建dom的函数
function createEl(Vnode) {
  let { tag, data, key, children, text } = Vnode;
  if (typeof tag === "string") {
    // 是元素的情况下
    Vnode.el = document.createElement(tag); // 创建元素
    // children的处理
    if (children && children.length) {
      children.forEach((child) => {
        // 递归创建
        Vnode.el.appendChild(createEl(child));
      });
    }
  } else {
    // 创建文本
    Vnode.el = document.createTextNode(text);
  }
  return Vnode.el;
}

