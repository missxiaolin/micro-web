# micro-web
## css 样式隔离

- css modules
- shadow dom
- minicss

## 父子应用通信

- props
- customevent

## react 15配置

~~~
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    path: ['./index.js']
  },
  module: {
    rules: [
      {
        test: /\.js(|x)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(c|sc)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
        }
      }
    ]
  },
  optimization: {
    splitChunks: false,
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react15.js',
    library: 'react15',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: 'http://localhost:9002/'
  },
  devServer: {
    // 配置允许跨域
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9002,
    historyApiFallback: true,
    hot: true,
  }
}
~~~

## react 16配置

~~~
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: { path: ['regenerator-runtime/runtime', './index.js'] },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react16.js',
    library: 'react16',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: 'http://localhost:9003'
  },
  module: {
    rules: [
      {
        test: /\.js(|x)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(cs|scs)s$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },

    ]
  },
  optimization: {
    splitChunks: false,
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9003,
    historyApiFallback: true,
    hot: true
  }
}
~~~

## vue 配置

~~~
const path = require('path');
const { name } = require('./package.json')

function resolve(dir) {
  return path.join(__dirname, dir);
}

const packageName = 'vue2';
const port = 9004;

module.exports = {
  lintOnSave: false,
  outputDir: 'dist', // 打包的目录
  assetsDir: 'static', // 打包的静态资源
  filenameHashing: true, // 打包出来的文件，会带有hash信息
  publicPath: 'http://localhost:9004',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: false,
    disableHostCheck: true,
    port,
    headers: {
      'Access-Control-Allow-Origin': '*', // 本地服务的跨域内容
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式 commonjs 浏览器，node环境
      // library: `${packageName}`,
      // libraryTarget: 'umd',
      libraryTarget: 'umd',
      filename: 'vue2.js',
      library: 'vac',
      jsonpFunction: `webpackJsonp_${name}`
    },
  },
};
~~~

## 全局store

~~~
import { createStore } from '../../micro/index'
const store = createStore()
window.store = store
store.subscribe((newValue, oldValue) => {
  console.log(newValue, oldValue, '---')
})
~~~

## 全局状态管理

~~~
export { createStore } from './store/index'
~~~

## 应用间通讯

~~~
window.microCustom
~~~

## demo 测试

[demo测试地址](https://github.com/missxiaolin/micro-app)