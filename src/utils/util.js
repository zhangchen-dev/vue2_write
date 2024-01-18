export const Hooks = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestory", "destoryed"];

let starts = {};
starts.data = function (parentVal,childVal) {
    return childVal
}; // 合并data
// starts.computed = function () {}; // 合并computed
// starts.watch = function () {}; // 合并datawatch
// starts.methods = function () {}; // 合并methods

// 遍历生命周期
Hooks.forEach((hooks) => {
  starts[hooks] = mergeHook;
});

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

export function mergeOptions(parent, child) {
  // 需要合并到的 为parent 子级为child
  // 源码 Vue.options =  {created:[a,b,c] , watch:[a,b,c,...]}
  const options = {};
  // 如果存在父级
  for (let key in parent) {
    mergeField(key);
  }
  // 存在子级不存在父级
  for (let key in child) {
    mergeField(key);
  }
  return options

  function mergeField(key) {
    // 策略模式 key有很多种类 watch created 等
    if (starts[key]) {
      options[key] = starts[key](parent[key], child[key]);
      return options;
    }else{
        options[key] = child[key] || parent[key]
    }
  }
}
