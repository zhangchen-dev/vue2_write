export function patch(oldVnode, Vnode) {
  console.log('%c 🌷🌷🌷🌷[ oldVnode, Vnode ]-2', 'font-size:13px; background:#57e54a; color:#9bff8e;', oldVnode, Vnode)
  // 将vnode 变成真实的dom
  // 第一次渲染的oldVnode是一个真实Dom
  if (oldVnode.nodeType === 1) {
    // 直接进行替换

    //1. 创建新的dom
    let el = createEl(Vnode);
    //2. 替换  获取父节点=》插入=》老元素删除
    let parentEl = oldVnode.parentNode; // body
    console.log('%c 🌷🌷🌷🌷[ parentEl ]-12', 'font-size:13px; background:#3145fc; color:#7589ff;', parentEl)
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

  // 创建映射表
  let map = function makeIndexBykey(child) {
    let _map = {};
    child.forEach((item, index) => {
      // 注意没有key
      if (item.key) {
        map[item.key] = index;
      }
    });
    return _map;
  };

  // 判断是同一个元素否
  function isSameVnode(_old, _new) {
    console.log(undefined === undefined); // true
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
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 交叉比较  ！！！交叉比较存在问题：元素插入顺序不对
      patch(oldStartVnode, newEndVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 交叉比较
      patch(oldEndVnode, newStartVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    }

    // 面试地方： 为什么需要添加key 并且key不能是索引 ？？？
    else {
      // 上述都不行  暴力比对
      // 1.0 创建旧元素的映射表
      // 2.0 从旧的中寻找新的元素是否存在 依据新元素进行暴力比对
      let moveIndex = map[newStartVnode.key];
      if (moveIndex == undefined) {
        // 不存在这个新值 直接添加
        parent.insertBefore(createEl(newStartVnode), oldStartVnode.el);
      } else {
        // 存在 则说明旧的存在新的
        let moveVnode = oldChildren[moveIndex]; // 获取到移动的元素
        oldChildren[moveIndex] = null; // 防止数组塌陷
        // 插入旧的过来
        parent.insertBefore(moveVnode.el, oldStartVnode.el);
        // 处理问题： 可能找到了 但只是这一层级的相同 其中存在的子级需要进行递归进入新的整个流程的比对中
        patch(moveVnode, newStartVnode);
      }
      // 上述完成 指针位移
      newStartVnode = newChildren[++newStartIndex];
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

  // 旧的多余删除
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      // 删除 注意上述变成的null的
      let child = oldChildren[i];
      if (child !== null) {
        parent.removeChild(child.el);
      }
    }
  }
}
