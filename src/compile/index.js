import { generate } from './generate';
import { parseHTML } from './parseAST';


export function compileToFunction(el) {
    // 1. 将html变成ast语法树
    let ast = parseHTML(el)
    // 2. 将AST语法树变成字符串拼接 =》 变成函数
    let code = generate(ast) // 字符串解析函数 _s 变量 _v 文本 _c 标签
    // 3. 获取到render的字符串 =》字符串变成函数
    let render = new Function(`with(this){return ${code}}`)
    return render
    // 将render函数变成vnode(虚拟dom)
}
