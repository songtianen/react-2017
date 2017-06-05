var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

// var nodeModulesPath = path.resolve(__dirname, 'node_modules')
// console.log(process.env.NODE_ENV)

module.exports = {
    entry: {
      app:path.resolve(__dirname, 'app/index.jsx'),
      // 将 第三方依赖 单独打包
      vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'es6-promise',
      'whatwg-fetch',
      'immutable'
    ]

  },
  output: {
    path: __dirname + "/build",
    filename: "[name].[hash:8].js",
     publicPath: './'
          },
  resolve:{
      extensions:['.js','.jsx']
  },


    module: {

        rules: [
            { test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              loader: 'babel-loader' },
            { test: /\.less$/,
              exclude: /node_modules/,
              use:ExtractTextPlugin.extract({
                fallback:"style-loader",
                use:["css-loader","postcss-loader","less-loader"]
              })
              // use:["style-loader",
              //      "css-loader",
              //      "postcss-loader",
              //      "less-loader"]
            },
            { test: /\.css$/,
              exclude: /node_modules/,
              use:ExtractTextPlugin.extract({
                fallback:"style-loader",
                use:["css-loader","postcss-loader"]
              })

            },
            { test:/\.(png|gif|jpg|jpeg|bmp)$/i,
              use:[{loader:"url-loader",options:{limit:5000,name:"img/[name].[hash:8].[ext]"}}]
            },  // 限制大小5kb
            { test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i,
              use:[{loader:"url-loader",options:{limit:5000,name:"fonts/[name].[hash:8].[ext]"}}]
            } // 限制大小小于5k
        ]
    },



    plugins: [
         // webpack 内置的 banner-plugin
         new webpack.BannerPlugin("Copyright by songtianen@github.com."),
        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.tmpl.html'
        }),

        // 热加载插件
        new webpack.HotModuleReplacementPlugin(),


        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        }),

        // 定义为生产环境，编译 React 时压缩到最小
        new webpack.DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
          }
        }),

    

        new webpack.optimize.UglifyJsPlugin({
            compress: {
              //supresses warnings, usually from module minification
              warnings: false
            }
        }),

        // 分离CSS和JS文件
        new ExtractTextPlugin('css/[name].[hash:8].css'),
        // 提供公共代码
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          filename: '[name].[hash:8].js'
    }),


    ]
}