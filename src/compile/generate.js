const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
// 处理属性
function geneProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 属性分类判断 特殊处理 style
    // {name:"style" , value: "color:red;fontSize:20px"}
    if (attr.name === "style") {
      // 将属性切割成对象形式存储
      let obj = {};
      attr.value.split(";").forEach((item) => {
        let [key, val] = item.split(":");
        obj[key] = val;
      });
      attr.value = obj;
    }
    // 拼接
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

// 处理子级的子节点
function genChildren(el) {
  let children = el.children;
  // 自己可能多个
  if (children) {
    return children.map((child) => gen(child)).join(",");
  }
}

function gen(node) {
  // 真正的子级的形式 为标签 1 是元素 3 是文本
  if (node.type === 1) {
    // 1 是元素 循环处理元素的情况
    return generate(node);
  } else {
    // 1. 纯文本 2 插值表达式
    let text = node.text; // 获取文本
    if (!defaultTagRE.test(text)) {
      // 不是插值表达式形式
      return `_v(${JSON.stringify(text)})`;
    }
    // 有插值表达式的情况 {{}} 可能存在多个的情况 也可能混合使用文本表达式
    else {
      let tokens = [];
      let lastindex = (defaultTagRE.lastIndex = 0);
      let match;
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;
        tokens.push(JSON.stringify(text.slice(lastindex, index))); // 内容
        if (index > lastindex) {
          // 添加内容
          tokens.push(JSON.stringify(text.slice(lastindex, index)));
        }
        // 解决插值表达式
        tokens.push(`_s(${match[1].trim()})`);
        lastindex = index + match[0].length;
        if (lastindex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastindex)));
        }
      }
      return `_v(${tokens.join("+")})`;
    }
  }
}
/**
 * <div id="app">hello {{msg}} ><h></h></div>
 * render函数
 * return _c('div',{id:app},_v('hello',+_s(msg)),_c)
 *
 */
export function generate(el) {
  // 注意属性 ｛style="fontSize:12px;color:red"｝这类属性需要变成对象 他在ast中是放在一个属性对象中了
  let children = genChildren(el);
  let code = `_c("${el.tag}",${el.attrs.length ? `${geneProps(el.attrs)}` : undefined},${children ? `${children}` : undefined})`;
  return code;
}
