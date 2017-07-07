
# babel 配置说明
[参考文档](https://leanpub.com/setting-up-es6/read)
仅说明一些不易理解的配置使用

## Babel 6: loose 和 非loose(normal) 模式（引用自互联网blog）

1. normal: 尽可能符合ECMAScript6语义的模式
2. loose: 提供更简单ES5代码的模式
    1. 生成的代码可能更快，对老的引擎有更好的兼容性，代码通常更简洁，更加的“ES5化”
    2. 你是在冒险——随后从转译的ES6到原生的ES6时你会遇到问题。这个险很不值得

```javascript
"babel": {
  "presets": [
    [
      "env",
      {
        "targets": { "node": "current”        }
        “loose”: true,
      }
    ],
    "stage-0",
    "react"  ]
}
```

```javascript
class Point {
    constructor(x, y){this.x = x;this.y = y;}
    test(){…}
}
```

转义后的代码比较：
normal模式： 在normal模式下，类的prototype 方法是通过Object.defineProperty 添加的来确保它们是不可以被枚举的，这是ES6规范所要求的。
loose模式：在loose模式下，用通常的赋值方式添加方法Point.prototype.test =，这种风格更像你用ES5手动编写代码


## targets.node,browserlist
1. 主要用于设定 编译后代码的 执行环境
2. 例如node的版本已经支持了许多es6特性，在编译阶段就原样输出，不进行编译
3. browserlist会根据设定的浏览器列表，对语法 进行原则性 必要的 编译

## targets.uglify

1. https://github.com/babel/babel-preset-env#targetsuglify
2. https://github.com/babel/babel-preset-env/pull/264



## modules:
1. "amd" | "umd" | "systemjs" | "commonjs" | false, defaults to "commonjs”.
2. 表示编译后的 代码 的模块方式，如果使用 amd 则 编译后的 代码风格为 amd
3. 例如："modules": “amd”
    1. 源代码：console.log(1);
    2. 编译后的代码为： define([], function () {'use strict'; console.log(1)});

## useBuiltIns

1. 参考说明：
    1. https://github.com/babel/babel-preset-env#targetsuglify
    2. http://2ality.com/2017/02/babel-preset-env.html
    3. https://leanpub.com/setting-up-es6/read#ch_babel-helpers-standard-library
2. 使用方式
    1. import "babel-polyfill”;
    2. import “core-js";
    3. 在为true时： 转化后代码，会在入口文件引入了  api填充代码， 设置false则直接转换为require(‘babel-polyfill’);

```javascript
"use strict";
require("core-js/modules/es6.typed.array-buffer");
require("core-js/modules/es6.typed.data-view");
require("core-js/modules/es6.typed.int8-array”);
…
```

4. import "babel-polyfill”; 实际也是依赖了core-js包，实际引入的就是core-js内部的pollyfill代码
5. 举例说明使用场景：
    1. Object.entries() api 有些客户端浏览器不支持，解决方案就是 引入 babel-polyfill
    2. core-js 模块 ![polyfill](assets/polyfill.png)
    3. 会自动引入这些 填充代码，保证了 Object.entries() 在客户端的有效执行
    4. 也可以自定义 按需 引入 填充代码



# babel 转义node代码后，对异常位置的定位 source-map-support

## 模块含义：
1. 出现错误的时候错误栈根据编译后代码直接定位到es6代码位置
2. 支持node和浏览器设置

## 参考文档：
[node-source-map-support](https://github.com/evanw/node-source-map-support)

## 使用方式：
1. 代码使用： require('source-map-support').install();
2. webpack使用：会在编译后代码的头部增加 引入方式代码：(require('source-map-support').install();)
        new webpack.BannerPlugin({
              banner: 'require("source-map-support").install();',
              raw: true,        
              entryOnly: false,
        }),


# babel-polyfill

## [需要引入polyfill的api： ](https://babeljs.io/learn-es2015)

测试的es6代码：以 Map repeat sign 特性测试

```javascript
import 'babel-polyfill';
const a1 = new Map([1, 2])
'a'.repeat(3);
Math.sign(-1);
```

babelrc

```javascript
"presets": [
      [
        "env",
        {
          "targets": {
            "browsers": [
              ">1%",
              "last 10 versions",
              "not ie < 9"
            ],
            "uglify": true
          },
          "modules": false,
          "useBuiltIns": true,
          "debug": true
        }
      ],
      "stage-0",
      "react"
```

* useBuiltIns： true 是转义后的代码

```javascript
import "core-js/modules/es6.typed.array-buffer";
import "core-js/modules/es6.typed.data-view";
import "core-js/modules/es6.typed.int8-array";
import ...

var a = true ? 1 : 2;
var a1 = new Map([1, 2]);
'a'.repeat(3);
Math.sign(-1);
```

`转义后的代码自动填充了Map Set 对应的polyfill`   
`debug为true时， 控制台会输出 babel转义时 引用的额外信息：插件等`

```bash

babel-preset-env: `DEBUG` option

Using targets:
{
  "chrome": "49",
  ...
}

Modules transform: false

Using plugins:
  check-es2015-constants {"android":"2.1","edge":"12","firefox":"45","ie":"9","ios":"4.2","safari":"5.1","uglify":true}
    ... 后面省略

Using polyfills:
  es6.map {"chrome":"49","android":"2.1","edge":"12","firefox":"45","ie":"9","ios":"4.2","safari":"5.1"}
  es6.set {"chrome":"49","android":"2.1","edge":"12","firefox":"45","ie":"9","ios":"4.2","safari":"5.1"}
  es6.weak-map {"chrome":"49","android":"2.1","edge":"12","firefox":"45","ie":"9","ios":"4.2","safari":"5.1"}
  es6.weak-set {"chrome":"49","android":"2.1","edge":"12","firefox":"45","ie":"9","ios":"4.2","safari":"5.1"}
  es6.reflect.apply {"android":"2.1","ie":"9","ios":"4.2","safari":"5.1"}
  es6.reflect.construct {"android":"2.1","edge":"12","ie":"9","ios":"4.2","safari":"5.1"}
  es6.reflect.define-property {"android":"2.1","edge":"12","ie":"9","ios":"4.2","safari":"5.1"}
  es6.reflect.delete-property {"android":"2.1","ie":"9","ios":"4.2","safari":"5.1"}
    ... 后面省略
```

输出了使用的插件 和 polyfill


* usebuiltIns： false 时 转义后的代码

```javascript
import "babel-polyfill";
var a = true ? 1 : 2;
var a1 = new Map([1, 2]);
'a'.repeat(3);
Math.sign(-1);
```

`控制台 仍会打印 babel转义输出`  

```bash
babel-preset-env: `DEBUG` option

Using targets:
{
  "chrome": "49",
  ...
}

Modules transform: false

Using plugins:
  check-es2015-constants {"android":"2.1","edge":"12","firefox":"45","ie":"9","ios":"4.2","safari":"5.1","uglify":true}
  transform-es2015-arrow-functions {"android":"2.1","edge":"12","ie":"9","ios":"4.2","safari":"5.1","uglify":true}
    ... 后面省略
```

并未输出 polyfill 的引用

## webpack使用方式
* 在入口文件增加polyfill
* useBuildIn 设置false

```javascript
  name: 'client',
  target: 'web',
  entry: {
    client: ['babel-polyfill', './src/client.js'],
  },
```

```javascript
modules: false,
useBuiltIns: false,
debug: false,
```
