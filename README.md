# gulp 构建工具

## 一、构建过程:

```bash
# 全局安装 gulp
npm i -g gulp

# shell 切换至工作目录（`gulpfile.js`存放目录）
cd xxx/xx

# 安装依赖
npm i

# 开发构建（在 localhost:3333 端口、支持热刷新页面）
npm run dev

# 生产构建
npm run build
```

## 二、基本目录:

* `config/` 为配置目录
  * `_default.js` gulp 默认配置
  * `index.js` 合并后的配置文件，给 gulpfile.js 引用
  * `projects.js` 用户自定义配置
* `dist/` 最后输出目录（开发阶段不用管它）
* `rev/` 静态文件版本管理对照表存放目录（gulp 脚本生成，可以不用管它）
* `src/` 为开发目录
  * `common` 通用静态资源目录，执行 `npm run build` 后会被复制到 dist 相应目录
    * `images` 通用图片资源
    * `libs` JS 库
    * `scss` 基础样式文件
  * `example/` **示例** 项目目录
    * `assets/` 存放项目内部的静态资源文件，如：字体、音乐等（可选）
    * `css/` 由 scss 生成，无需手动修改
    * `img/` 图片
    * `js/`
    * `lib/` 存放第三方库，构建后会被复制到 dist 的相应目录（可选）
    * `scss/` scss 目录，处理后会输出至 css 目录
    * `index.html`

## 三、`/config/projects.js` 文件说明

1. `_currentProject` 为当前构建项目
2. `ProjectsConfig` 存放项目的配置信息
3. `ProjectsConfig` 内的配置和 `/config/_default.js` 内的配置合并后会传给 gulp，并且 `ProjectsConfig` 内的信息优先级更高
4. 配置 `ProjectsConfig` 时可以参考 `/config/_default.js`

## 四、其它:

### 1. `node-sass` 编译失败或 `imagemin-jpeg, imagemin-png` 等编译过慢

使用 cnpm 代替 npm

```bash
# 全局安装 cnpm
npm i -g cnpm --registry=https://registry.npm.taobao.org

# shell 切换至工作目录（`gulpfile.js`存放目录）
cd xxx/xx

# 安装依赖
cnpm i
```

### 2. 使用 yarn

```bash
# 全局安装 gulp
yarn global add gulp

# shell 切换至工作目录（`gulpfile.js`存放目录）
cd xxx/xx

# 安装依赖
yarn

# 开发构建
yarn dev

# 生产构建
yarn build
```
