// new Vue的入口文件

import { renderMixin } from "./Vnode/index"
import { initGlobleApi } from "./globle-api/index"
import { initMixin } from "./init"
import { stateMixin } from "./initState"
import { lifecycleMixin } from "./lifecycle"

function Vue(options){
    // 初始化
    this._init(options)
}
// 初始化的抽离出去的函数
initMixin(Vue)
lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue)
stateMixin(Vue) // 给原型添加方法  vm 添加 $nextTick


// 全局方法 Vue.mixin 等
initGlobleApi(Vue)
export default Vue
