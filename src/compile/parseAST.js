// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;

/**
 *
 * @param  html 种类
 * <div id="app">hello {{msg}}<h></h></div> 开始标签 结束标签 文本
 */

// 遍历
// 创建抽象语法树
function createASTElement(tag,attrs){
    return {
        tag,
        attrs,
        children:[],
        type:1,
        parent:null,
    }
}

let root;
let createParent // 当前元素的父级
let stack = [] // 使用栈的数据结构
// 开始标签
function start(tag, attrs) {
  let element = createASTElement(tag,attrs);
  if(!root){
    root = element
  }
  createParent = element
  stack.push(element)
}
// 文本标签
function charts(text) {
  // 空格
  text = text.replace(/\s/g,'')
  if(text){
    createParent.children.push({
        type:3,
        text,
    })
  }
}
// 结束标签
function end(tag) {
  // 结束的标签
  let element = stack.pop()
  createParent = stack[stack.length-1]
  if(createParent){ // 元素的闭合
    element.parent = createParent.tag
    createParent.children.push(element)
  }
}

export function parseHTML(html) {
  while (html) {
    // 判断标签 <>
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {

      // 1. 开始标签
      const startTagMatch = parseStartTag(); // 开始标签的内容
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      // 2. 结束标签
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
      }
      continue;
    }

    // 3. 文本内容
    let text;
    if (textEnd > 0) {
      // 获取文本的内容
      text = html.substring(0, textEnd);
    }
    if (text) {
      charts(text);
      advance(text.length);
    }
  }
  // 解析开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen); // 结果 或者 false
    if (!start) {
      return;
    }
    let match = {
      tagName: start[1],
      attrs: [],
    };
    // 删除已经匹配的
    advance(start[0].length);
    // 解决属性 注意多个：需要遍历 直到结束标签
    let attr;
    let end;
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      match.attrs.push({
        name: attr[1],
        value: attr[3] || attr[4] || attr[5], // 一个属性可能有多个值 所以需要都添加上 比如 class的类名
      });
      advance(attr[0].length);
    }
    if (end) {
      advance(end[0].length);
      return match;
    }
  }

  // 删除已经匹配的内容
  function advance(n) {
    html = html.substring(n);
  }

  return root
}