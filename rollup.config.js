import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js', // 打包的入口文件
    output: {
        file:'dist/Vue.js',
        format:'umd', // 在window上添加Vue 可以使用new Vue使用
        name:'Vue',
        sourcemap:true, // 映射

    },
    plugins:[
        babel({
            exclude:'node_moudules/**'
        }),
        serve({
            port:3000,
            contentBase:'', // 空字符串 标识当前目录
            openPage:'/index.html'
            // openPage:'/watcher.html'
        })
    ]
}