export function patch(oldVnode, Vnode) {
  // 将vnode 变成真实的dom
  // 第一次渲染的oldVnode是一个真实Dom
  if (oldVnode.nodeType === 1) {
    // 直接进行替换

    //1. 创建新的dom
    let el = createEl(Vnode);
    //2. 替换  获取父节点=》插入=》老元素删除
    let parentEl = oldVnode.parentNode; // body
    parentEl.insertBefore(el, oldVnode.nextsibling);
    parentEl.removeChild(oldVnode);
    return el;
  } else {
    // 后续更新时候的dom diff比对
    // 分情况讨论
    // 1. 元素不同
    if (oldVnode.tag !== Vnode.tag) {
      // 直接进行替换
      oldVnode.el.parentNode.replaceChild(createEl(Vnode), oldVnode.el);
    }
    // 标签一样 text 属性 文本不一样等
    else if (!oldVnode.tag) {
      // 文本情况
      if (oldVnode.text !== Vnode.text) {
        oldVnode.el.textContent = Vnode.text;
      }
    }
    // 标签一样的 属性不同
    // 直接复制 然后处理细节
    let el = (Vnode.el = oldVnode.el); // 保存旧的
    updateProps(Vnode, oldVnode.data);
    let oldChildren = oldVnode.children || [];
    let newChildren = Vnode.children || [];
    // diff 元素
    // 1. 老的元素有子级 新的没有子级
    // 2. 老的元素没有子级 新的有子级
    // 3. 都有子级
    if (oldChildren.length && newChildren.length) {
      // 创建方法
      // ！！！bug 此处最后一个参数必须是真实的dom 因为此处追加要在它上面添加 如果拿到虚拟的再次创建 它就不是同一个之前的那个真实的dom了
      updataChild(oldChildren, newChildren, el);
    } else if (oldChildren.length) {
      // 直接使用空覆盖
      el.innerHTML = "";
    } else if (newChildren.length) {
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        // 添加到真实DOM中
        el?.appendChild(createEl(child));
      }
    }
  }
}
// 创建真实dom的函数
export function createEl(Vnode) {
  const { tag, data, key, children, text } = Vnode;
  if (typeof tag === "string") {
    // 是元素的情况下
    Vnode.el = document.createElement(tag); // 创建元素
    updateProps(Vnode);
    // children的处理
    if (children && children.length) {
      children.forEach((child) => {
        // 递归创建
        child && Vnode.el.appendChild(createEl(child));
      });
    }
  } else {
    // 创建文本
    Vnode.el = document.createTextNode(text);
  }
  return Vnode.el;
}

// 比对添加属性
export function updateProps(Vnode, oldProps) {
  let newProps = Vnode.data || {}; // 获取到当前新节点的属性
  let el = Vnode.el; // 获取当前真实的节点
  // 老的有属性 新的没有
  for (let key in oldProps) {
    if (!newProps[key]) {
      // 删除旧的属性
      el.removeAttribute[key];
    }
  }

  // 老的style={"color:red"} 新的style={"backgroud:red"}

  // 第一次初始化相当一这种情况
  // 新的有 老的没有
  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}

function updataChild(oldChildren, newChildren, parent) {
  // diff算法实现最小量更新
  // 创建双指针
  let oldStartIndex = 0; //旧的开头指针
  let oldStartVnode = oldChildren[oldStartIndex];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0; //旧的开头指针
  let newStartVnode = newChildren[newStartIndex];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  // 判断是同一个元素否
  function isSameVnode(_old, _new) {
    return _old.tag === _new.tag && _old.key === _new.key;
  }

  // 循环
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 比对
    // 都从头部比较
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 是 则进入递归比较子元素
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if(isSameVnode(oldStartVnode,newEndVnode)){
      // 交叉比较
      patch(oldStartVnode,newEndVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
  }

  // 添加多余的子级
  // 新增的情况
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 追加
      parent.appendChild(createEl(newChildren[i]));
    }
  }
  console.log("%c 🌷🌷🌷🌷[ newStartIndex<=newEndIndex ]-140", "font-size:13px; background:#0d937a; color:#51d7be;", parent, newStartIndex, newEndIndex);
}
