import { mergeOptions } from "../utils/util";

export function initGlobleApi(Vue) {
  Vue.options = {};
  // 源码 Vue.options =  {created:[a,b,c] , watch:[a,b,c,...]}
  Vue.Mixin = function (mixin) {
    // mixin合并对象
    Vue.options = mergeOptions(this.options, mixin);
  };

  // 组件
  // 1.0 在vue的属性中定一个全局的组件的方法
  Vue.options.components = {} // 放我们的全局组件
  Vue.component = function(id,componentDef){
    // 注意
    componentDef.name = componentDef.name || id
    // 核心：Vue创建组件的核心 Vue.extend()
    componentDef = this.extend(componentDef) //  这里返回一个构造器（实例）
    this.options.components[id] = componentDef
  }

  // 创建一个子类
  Vue.extend = function(options){
    // console.log( options,this.options) // this.options中含有局部的定义组件
    const _super = this
    // 子组件的实例
    const Sub = function vuecomponent(opts){
      // 注意new Sub（）.mount()
      // 初始化
      this._init(opts)
    }
    // 子组件需要继承父组件中的属性  实现：Vue  类的继承
    Sub.prototype = Object.create(_super.prototype)
    //  子组件中的this的指向
    Sub.prototype.constructor = Sub
    // 将父组件中的属性合并到子组件中
    Sub.options = mergeOptions(this.options,options)
    return Sub
  }
}


