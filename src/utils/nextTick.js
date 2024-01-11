// nextTick的实现 这个方法在原型上添加
let callback = [];
let pending = false;
let timerFunc;

function flush() {
  callback.forEach((cb) => cb());
  pending = false;
}

// 处理兼容问题
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flush); // 异步执行
  };
} else if (MutationObserver) {
  // h5的处理异步放方法 可以监听dom的变化 监控完毕 然后异步更新
  let observe = new MutationObserver(flush);
  let textNode = document.createTextNode(1); // 创建文本节点
  observe.observe(textNode, { characterData: true }); // 观测文本内容
  timerFunc = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  // ie
  timerFunc = () => {
    setImmediate(flush);
  };
}
export function nextTick(cb) {
  callback.push(cb);
  if (!pending) {
    timerFunc(); // 这个方法是一个异步的方法  vue3:使用promise.then()实现 vue2 处理兼容问题
  }
}
