// new Vue的入口文件

import { renderMixin } from "./Vnode/index";
import { createEl, patch } from "./Vnode/patch";
import { compileToFunction } from "./compile/index";
import { initGlobleApi } from "./globle-api/index";
import { initMixin } from "./init";
import { stateMixin } from "./initState";
import { lifecycleMixin } from "./lifecycle";

function Vue(options) {
  // 初始化
  this._init(options);
}
// 初始化的抽离出去的函数
initMixin(Vue);
lifecycleMixin(Vue); // 添加生命周期
renderMixin(Vue);
stateMixin(Vue); // 给原型添加方法  vm 添加 $nextTick

// 全局方法 Vue.mixin 等
initGlobleApi(Vue);

// 实现一个手动的数据变换后的vnode更新 之前的实现方式
// let vm1 = new Vue({ data: { name: "张三" } });
// let render1 = compileToFunction(`<ul><li key="a">a</li><li key="b">b</li><li key="bb">bb</li><li key="bbb">bbb</li><li key="f">fff</li></ul>`);
// let vnode1 = render1.call(vm1);
// document.body.appendChild(createEl(vnode1));
// // 模仿数据更新
// let vm2 = new Vue({ data: { name: "李四" } });
// let render2 = compileToFunction(`<ul><li key="f">fff</li><li key="g">ggg</li><li key="h">hhh</li><li key="a">a</li></ul>`);
// let vnode2 = render2.call(vm2);

// patch实现比对 此处是两个虚拟dom的比对
// patch(vnode1, vnode2);

// 上述模拟更新dom手动触发render 需要添加到生命周期中自动触发

export default Vue;
