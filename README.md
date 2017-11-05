# gulp构建工具
> * 支持SASS转CSS，支持CSS自动添加前缀；
> * 支持JS校验、压缩；支持图片压缩；
> * 支持静态资源版本管理；

---
## 构建过程:
``` bash
# 全局安装gulp
yarn global gulp

# shell 切换至工作目录（`gulpfile.js`存放目录）
cd xxx/xx

# 安装依赖
yarn

# 开发构建（在 localhost:3333 端口、支持热重启）
yarn dev

# 生产构建
yarn build
```


## `config` 目录说明
存放配置文件

1. `_autoprefixer.js`: 自动添加 CSS 兼容前缀配置文件
2. `_base64.js`: 图片转 base64 配置文件
3. `_browser-sync.js`: 开发环境浏览器自动刷新配置文件
4. `_cssmin.js`: CSS 压缩配置文件
5. `_htmlmin.js`: HTML 压缩配置文件
6. `_imagemin.js`: 图片压缩配置文件
7. `_path.js`: 生产环境静态资源相对路径转绝对路径配置文件
8. `_px2rem.js`: PX 转 REM 配置文件(配合 flexible.js 使用)
9. `_sprite.js`: 生成雪碧图配置文件(功能待完善)
10. `index.js`: 入口文件，修改 `projectName` 变量切换当前开发项目


## gulp命令
> `shell`下切换到工作目录（`gulpfile.js`存放目录），执行如下命令

1. `gulp sprite`：合成雪碧图
2. `gulp watch:less`：实时编译LESS
3. `gulp watch:sass`：实时编译SASS
4. `gulp watch:browser`：开发构建，等同 `npm run dev`
5. `gulp build`：生产构建，等同 `npm run build`


## 其他:
1. `gulpfile.js` 内有详细注释。
2. 已修复无法压缩 `jpg jpeg` 图片的BUG。
 - 阅读 `gulp-imagemin` 源码后发现这个插件只能传入 `plugins`(Array Object)，不可传入 `options`(Original Object)。


## 参考资料：
- [x] [gulp详细入门教程](http://www.ydcss.com/archives/18)
- [x] [gulp系列教程](https://gold.xitu.io/entry/568f915700b0bca0ca22768e)
- [x] [npm官网(这里有插件的详细介绍)](https://www.npmjs.com/)
- [x] [gulp-rename插件](https://segmentfault.com/q/1010000006872625)
