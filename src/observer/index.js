import { ArrayMethods } from "./arr";
import Dep from "./dep";

export function observer(data) {
  if (typeof data != "object" || data == null) {
    return data;
  }
  // console.log(typeof [0,1] === 'object') //  true
  // 劫持对象数据 类Obeser
  return new Observer(data);
}

// vue2 通过使用Object.defineProperty 缺点：它只能对其中的一个属性进行劫持 所以需要遍历

class Observer {
  constructor(value) {
    Object.defineProperty(value, "__ob__", {
      enumerable: false,
      value: this,
    });
    this.dep = new Dep();
    // 判断数据
    if (Array.isArray(value)) {
      // 数组的函数劫持
      value.__proto__ = ArrayMethods;
      // 处理数组对象的情况
      this.observerArrary(value); // 处理数组对象的劫持
    } else {
      // 遍历劫持过程
      this.walk(value);
    }
  }
  walk(data) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      // 对每个属性进行劫持
      let key = keys[i];
      let value = data[key];
      // 劫持对象中的某个属性
      defineReactive(data, key, value);
    }
  }

  observerArrary(value) {
    // 遍历劫持
    for (let i = 0; i < value.length; i++) {
      observer(value[i]);
    }
  }
}

function defineReactive(data, key, value) {
  let childDep = observer(value);
  let dep = new Dep(); // 给每个属性添加dep
  // !!! 因为列表也是会走这一步的所以此处会将每一个列表中的值添加上自己的dep，而那个childDep其实就是给总的array添加的dep
  Object.defineProperty(data, key, {
    get() {
      // 收集watcher 也即收集依赖 双向添加dep watcher
      if (Dep.target) {
        dep.depend();
        if (childDep.dep) {
          childDep.dep.depend(); // 数组收集依赖
        }
      }
      return value;
    },

    set(newValue) {
      if (newValue === value) return;
      // 代理设置的值
      observer(newValue);
      value = newValue;
      // 更新数据
      dep.notify();
    },
  });
}
