const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    mode: "production",
    devtool: "cheap-module-source-map",
    entry: {
        // lodash: './src/lodash.js',
        main: './src/index.js',
        // sub: './src/index.js',

    },
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
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
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
    optimization: {
        // 线上没必要
        // usedExports: true, //开启器treeShaking,被使用的打包
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
                vendors: {   // 从包里面引的分割到这里
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // filename: "vendors.js"
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    // filename: "common.js"
                }
            }
        }
    },
    plugins: [new HtmlWebpackPlugin({
        template: "src/index.html"
    }), new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
        // new webpack.HotModuleReplacementPlugin()  线上没必要
    ],
}
