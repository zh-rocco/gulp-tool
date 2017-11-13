# gulp构建工具

## 构建过程:
``` bash
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

## 说明:

### 1. `node-sass`编译失败或`imagemin-jpeg、imagemin-png`等编译过慢
使用 cnpm 代替 npm
``` bash
# 全局安装 cnpm
npm i -g cnpm --registry=https://registry.npm.taobao.org

# shell 切换至工作目录（`gulpfile.js`存放目录）
cd xxx/xx

# 安装依赖
cnpm i
```

### 2. 使用 yarn
``` bash
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
