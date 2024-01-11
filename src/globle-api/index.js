import { mergeOptions } from "../utils/util";

export function initGlobleApi(Vue) {
  Vue.options = {};
  // 源码 Vue.options =  {created:[a,b,c] , watch:[a,b,c,...]}
  Vue.Mixin = function (mixin) {
    // mixin合并对象
    Vue.options = mergeOptions(this.options, mixin);
  };
}
