const webpack = require('webpack')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
    entry: {
        // lodash: './src/lodash.js',
        main: './src/index.js',
        // sub: './src/index.js',

    },
    // devtool: "none",
    // development
    devtool: "eval-cheap-module-source-map",
    mode: "development",
    // 不知道怎么办的时候,进入到这个模块里找
    module: {
        rules: [
            // {
            //     test: /\.(png|jpg|gif)$/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 //占位符(名称无乱码)
            //                 name:'[name].[ext]',
            //                 outputPath: 'images/'
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //占位符(名称无乱码)
                            name: '[name].[ext]',
                            outputPath: 'images/',
                            limit: 8192
                        }
                    },
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        // 重新走下面的两个loader
                        importLoaders: 2,
                        // 开启css模块化
                        modules: true,
                    },
                }, {
                    loader: 'postcss-loader'
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                    }
                ],
                exclude: /node_modules/   // 忽略包,这样编译更快
            }
        ]
    },
    output: {
        // filename: "bundle.js",
        filename: "[name].js",  // 重命名
        chunkFilename: "[name].chunk.js",  // 分割的名称
        path: path.resolve(__dirname, 'dist'),
        // publicPath: "https://cdn.com"  // 打包后src 拼接域名
    },
    devServer: {
        contentBase: './dist',
        open: true, // 自动打开浏览器
        historyApiFallback: true,
        // watchContentBase: true, // 在文件修改之后，会触发一次完整的页面重载。
        port: 8000, // 端口号
        proxy: {  // 代理
            '/api': 'http://localhost:3000'
        },
        hot: true, // 热替换  // css应用
        // hotOnly: true  // 如果模块热替换功能不生效，则不刷新网页
    },
    optimization: {
        usedExports: true, //开启器treeShaking,被使用的打包
        splitChunks: {
            chunks: "all", // 代码分割了
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,  //当用了xx次进行分割
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // filename: "vendors.js"
                },
                default: {
                    priority: -20,
                    reuseExistingChunk: true,
                    // filename: "common.js"

                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html"
        }), new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
}
