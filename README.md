# codescanchange_webpack_plugin

![codescanchange_webpack_plugin](https://z1.ax1x.com/2023/09/17/pPhVnnP.png)

<p>
支持webpack4+ / 5+(不区分react或vue,只处理构建后的代码);
<br />
对webpack构建后的代码进行替换，在静态代码扫描.js文件的时候，能够通过“静态扫描”软件的规则；
</p>
<p>
至于是否影响原本功能，看使用者具体如何替换和修改原本代码中的扫描问题；
</p>

<p align="left">
    <img src="https://www.oscs1024.com/platform/badge/liyuec/easyExcelJs.svg" />
    <img src="https://img.shields.io/badge/size-6.56kb-blue" />
    <img src="https://img.shields.io/badge/license-MIT-orange" />
    <img src="https://img.shields.io/badge/converage-50%25-red" />
    <img src="https://img.shields.io/badge/version-1.0.0-lightgrey" />,
</p>

#目录
<ul>
  <li><a href="#npm-install">npm install or Yarn install</a></li>
  <li><a href="#参数说明">参数说明</a></li>
  <li><a href="#使用方法">基本使用与设计思路</a></li>
</ul>

## npm install[⬆](#目录)<!-- Link generated with jump2header -->
```shell
npm i codescanchange_webpack_plugin -S -D
```

```shell
yarn install codescanchange_webpack_plugin -S -D
```

## 参数说明[⬆](#目录)<!-- Link generated with jump2header -->

| 参数名            | 描述 |
| ---------------- | ----------- |
| distFileName          | 模糊匹配的构建后代码名，比如vendors则匹配文件名中存在 vendors 的.js |
| targetCode         | 想要替换的代码 |
| replaceCode       | replace后的代码 |


参数必须是一个数组 + 对象的形式，方便一次性配置多个参数;

## 使用方法[⬆](#目录)<!-- Link generated with jump2header -->
### 引入插件
```javascript

const codescanchange_webpack_plugin = require("codescanchange_webpack_plugin");

```

### 使用组件：单组替换
```javascript

///在plugin中加入
new codescanchange_webpack_plugin([{
    "distFileName":"chunk-vendors",
    "targetCode":"this.hoverTimer=setTimeout(this.clearHoverZone,this.panel.config.hoverThreshold)",
    "replaceCode":"console.log('trfchange')"
}])

///vuecli3+参见vue.config,例如
configureWebpack: {
    plugins: [
        {
            "distFileName":"chunk-vendors",
            "targetCode":"this.hoverTimer=setTimeout(this.clearHoverZone,this.panel.config.hoverThreshold)",
            "replaceCode":"console.log('trfchange')"
        }
    ]
}
```

### 使用插件：多组替换
```javascript

///在plugin中直接加入多个new 引入
new codescanchange_webpack_plugin([
    {
        "distFileName":"app",
        "targetCode":"want to change code",
        "replaceCode":"change code"
    },
    {
        "distFileName":"other",
        "targetCode":"other code",
        "replaceCode":"other code to change code"
    },
])

```