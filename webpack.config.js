const path = require("path");
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS=new ExtractTextPlugin({
    disable: process.env.NODE_ENV == 'development' ? true : false, // 开发环境下直接内联，不抽离
    filename: 'css/app.css',// 单个entry时，可写死
    allChunks: true
});
const extractLESS=new ExtractTextPlugin({
    disable: process.env.NODE_ENV == 'development' ? true : false, // 开发环境下直接内联，不抽离
    filename: 'css/appless.css',// 单个entry时，可写死
    allChunks: true
});
module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        // filename: '[name]-[hash:8].js',
        filename: 'js/build.js',
        path: path.resolve(__dirname, './dist')
    },
    devServer: {
        // 必须配置的选项，服务启动的目录，默认为跟目录
        contentBase: './dist',
        // 使用热加载时需要设置为 true
        hot: true,
        /**
         * 下面为可选配置
         */
        // 指定使用一个 host。默认是 localhost
        host: 'localhost',
        // 端口号
        // port: 8000,
        // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过设置为 true 进行启用
        // historyApiFallback: {
        //     disableDotRule: true
        // },
        historyApiFallback: true,
        // 出现错误时是否在浏览器上出现遮罩层提示
        overlay: true,
        /**
         * 在 dev-server 的两种不同模式之间切换
         *   默认情况下，应用程序启用内联模式 inline
         *   设置为 false，使用 iframe 模式，它在通知栏下面使用 <iframe> 标签，包含了关于构建的消息
         */
        // inline: true,
        /**
         * 统计信息，枚举类型，可供选项：
         *      "errors-only": 只在发生错误时输出
         *      "minimal": 只在发生错误或有新的编译时输出
         *      "none": 没有输出
         *      "normal": 标准输出
         *      "verbose": 全部输出
         */
        // stats: "errors-only",
        // 设置接口请求代理，更多 proxy 配置请参考 https://github.com/chimurai/http-proxy-middleware#options
        proxy: {
            "/commons": {
                target: "http://172.16.1.99",
                changeOrigin: true,
                ws: true
                },
            "/api": {
                target: "http://172.16.1.99",
                changeOrigin: true,
                ws: true
                },
            "/config": {
                target: "http://172.16.1.99",
                changeOrigin: true,
                ws: true
                // pathRewrite: {
                //   '^/api': ''
                // }
            }
        }
    },
    resolve: { // （方案二）修改别名，import Vue from ‘vue’ 这行代码被解析为 import Vue from ‘vue/dist/vue.esm.js
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new HTMLWebpackPlugin({// 打包输出HTML
            minify: { // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true// 压缩内联css
            },
            filename: 'index.html',
            template: path.resolve(__dirname, './index.html')
        }),
        // 用法：new CleanWebpackPlugin(paths [, {,options}])
        new CleanWebpackPlugin(),
        // new webpack.HotModuleReplacementPlugin()//热加载
        new VueLoaderPlugin(),
        extractCSS,
        extractLESS
    ],
    module: {
        rules: [
            {//解析vue文件的loader
                test:/\.vue$/,
                use:"vue-loader"
            },
            {//解析css文件的loader
                test: /\.css$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',//编译后用什么loader来提取css文件
                    // use:'css-loader' ,
                    use: [
                        { loader: 'css-loader' },
                        {
                            //浏览器添加前缀
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('autoprefixer')({
                                        broswers: ['last 2 versions']
                                    })
                                ]
                            }
                        }
                    ],
                    publicPath: '../'//打包时配置图片资源引入正确
                })
            },
            { // 解析less文件的loader
                test: /\.less$/,
                use: extractLESS.extract({
                    fallback: 'style-loader',
                    // use: ['css-loader','less-loader'],
                    use: [
                        { loader: 'css-loader' },
                        {
                            //浏览器添加前缀
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('autoprefixer')({
                                        broswers: ['last 2 versions']
                                    })
                                ]
                            }
                        },
                        {loader: 'less-loader'}
                    ],
                    publicPath: '../'
                })
            },
            { // 添加解析js的loader
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 1024 * 8, // 8k以下的base64内联，不产生图片文件
						fallback: 'file-loader', // 8k以上，用file-loader抽离（非必须，默认就是file-loader）
						name: '[name].[ext]?[hash]', // 文件名规则，默认是[hash].[ext]
						outputPath: 'images/', // 输出路径
						// publicPath: '../'  // 可访问到图片的引用路径(相对/绝对)
                    }
                }
            },
            // 解析字体的loader
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    }
}