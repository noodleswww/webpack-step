

## webpack config

## 使用 es6 配置 webpack.config 并独立运行
* [参考文档](https://stackoverflow.com/questions/31903692/how-can-i-use-es6-in-webpack-config-js)
* Try naming your config as `webpack.config.babel.js` . You should have babel-register included in the project.

### 入口entry

```javascript
entry: {
app: './src/index.js',
vendor: ['react', 'react-dom'],
},
output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),  //  path: 'dist',
},
```

* vendor 打包了 第三方公共模块
* 两个入口文件 打包后的文件名 对应到 Output的 filename
* 输出目录的 path 推荐使用绝对路径

### module 规则设置方式
* no.1

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    ...
  ]
}
```

* no.2 使用use配置方式  并且 使用 `options`
    * 写法和 no1 有差异
    * options 写在了 use 内部

```javascript
module: {
  rules: [
    {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 1024 * 20, // 20kb
            },
          }
        ],
    },
    ...
  ]
}
```

* no.3 使用普通模式 配置    `options`
    * 直接使用 `loader`
    * `options` 和 loader 平级

```javascript
module: {
  rules: [
    {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        minimize: true,
      },
    }
  ]
}
```

### plugins
* `webpack-manifest-plugin`
    * 打包文件对应关系
    * [文档地址](https://github.com/danethurber/webpack-manifest-plugin)
    
        ```javascript
        {
          "app.js": "app.bundle.js",
          "licai-ac.png": "287de5e23eb3e4509b96d31c6ec774d7.png",
          "test.woff": "966c3a712cecc78e3b85035555415194.woff",
          "vendor.js": "vendor.bundle.js"
        }
        ```

* `html-webpack-plugin`
    * 使用html模板 并且注入打包资源
    * [文档地址](https://github.com/jantimon/html-webpack-plugin)

* `new webpack.HotModuleReplacementPlugin()`
    * [文档地址](https://doc.webpack-china.org/guides/hot-module-replacement/)
    * 允许在运行时更新各种模块，而无需进行完全刷新
    * 使用方式：
        * 入口文件 增加代码：
        
        ```javascript
        if (module.hot) {
          module.hot.accept('./test', function() {
            console.log('Accepting the updated library module!');
            console.log(add(33, 33));
          })
        }
        ```
        
    * 其他代码和框架:社区还有许多其他 loader 和示例，可以使 HMR 与各种框架和库(library)平滑地进行交互……
        * React Hot Loader：实时调整 react 组件。
        * Vue Loader：此 loader 支持用于 vue 组件的 HMR，提供开箱即用体验。
        * Redux HMR：无需 loader 或插件！只需对 main store 文件进行简单的修改。

## 开发服务器等相关
### 无服务器配置，直接使用webpack编译
* `webpack --config webpack.config.js --progress --verbose --watch`
* 自动watch修改并编译
* 可以配合静态服务器 `serve` 等使用

### `serve`
* [文档地址](https://github.com/zeit/serve)
* 简单的静态服务器，可以配合 webpack
* 对应目录启动 一个静态资源服务器

### `webpack-dev-server`
* [文档地址](https://github.com/webpack/webpack-dev-server)
* 提供了一个服务器和实时重载（live reloading） 功能
* 使用方式：
    * 默认方式：
        * 在项目根目录直接执行 `webpack-dev-server --open`
        * 自动在浏览器中打开 http://localhost:8080，并且自动对应到了 编译目录对应的页面
    * 自定义配置：

        ```javascript
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 8080,
            headers: {
              'X-Custom-Name': 'wxx',
            },
            hotOnly: true,
          }
        ```

* 特点：
    * 可以配置代理
    * 自动检测webpack.config并执行 webpack编译
    * 编译后自动启动服务器并监听8080 端口
    * 无需手动 去执行 webapack的编译，内部已经自动集成
    * 无需第三方静态服务器
    * 在监听改动编译后，页面会自动 `reload`
    * 相当于 `serve` `webpack...` 的组合，同时扩展了更多功能
    
### `webpack-dev-middleware`
* [文档地址](https://doc.webpack-china.org/guides/development/)
* webpack-dev-middleware 适用于基于链接的中间件环境（connect-based middleware stacks）。
* 如果你已经有一个 Node.js 服务器或者你想要完全控制服务器，这将很实用。
* 具备了 `webpack-dev-server` 的配置功能

```javascript
var compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  publicPath: "/" // 大部分情况下和 `output.publicPath`相同
}));
```

* 使用 node server， webpack-dev-middleware做为中间件， 并且 启用热替换方式
    * 引入插件  `webpack-hot-middleware`
    * node use 产检
    * 入口文件加入    `'webpack-hot-middleware/client?name=client&reload=true'`
    * devServer 配置可以删除

```javascript
server.js
// https://github.com/webpack/webpack-dev-middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/', // 大部分情况下和 `output.publicPath`相同
  quiet: true,
  watchOptions: {},
}));
// https://github.com/glenjamin/webpack-hot-middleware
app.use(webpackHotMiddleware(compiler, { log: false }));

webpack.config.js
entry: {
app: ['./src/index.js', 'webpack-hot-middleware/client?name=client&reload=true', 'webpack/hot/only-dev-server'],
},
```

## react babel 配置
### webpack 配置

```javascript
{
    test: /\.jsx?$/,
    include: path.resolve(__dirname, './src'),
    loader: 'babel-loader',
    options: {
      cacheDirectory: isDebug,
      babelrc: false,
      presets: [
        ['env', {
          targets: {
            browsers: pkg.browserslist,
            uglify: true,
          },
          modules: false,
          useBuiltIns: false,
          debug: false,
        }],
        'stage-0',
        'react',
        ...isDebug ? [] : ['react-optimize'],
      ],
      plugins: [
        ...isDebug ? ['transform-react-jsx-source'] : [],
        ...isDebug ? ['transform-react-jsx-self'] : [],
      ],
    },
},
```

### react， es6 相关包
```bash
"babel-core": "^6.25.0",
"babel-loader": "^7.1.1",
"babel-plugin-istanbul": "^4.1.4",
"babel-plugin-rewire": "^1.1.0",
"babel-preset-env": "^1.6.0",
"babel-preset-react": "^6.24.1",
"babel-preset-react-optimize": "^1.0.1",
"babel-preset-stage-0": "^6.24.1",
```

### babel配置

```bash
"babel": {
    "presets": [
      [
        "env",
        {
          "targets": {
            "node": "current"
          }
        }
      ],
      "stage-0",
      "react"
    ],
    "env": {
      "test": {
        "plugins": [
          "istanbul",
          "rewire"
        ]
      }
    },
    "ignore": [
      "/node_modules/",
      "/build/chunks/",
    ]
  }
```

### 配置 react 热替换
* 1 在node，webpack-dev-middleware, webpack-hot-middleware的基础上，入口文件增加判断
    * `components/Footer.js`

        ```javascript
          module.hot.accept('./components/Footer', () => {
            const NextRootContainer = require('./components/Footer').default;
            render(<NextRootContainer />, document.getElementById('app'));
          });
        ```
        
    * 可以进行 Footer组件静态文本的热替换

* 2 集成 [react-hot-loader](http://gaearon.github.io/react-hot-loader/getstarted/)

* 在1 的基础上已经可以热替换，为什么要集成 `react-hot-loader`
    * webpack-dev-server自己的--hot模式只能即时刷新页面，但状态保存不住。
    * React有一些自己语法(JSX)是HotModuleReplacementPlugin搞不定的。而hot-loader在--hot基础上做了额外的处理，来保证状态可以存下来