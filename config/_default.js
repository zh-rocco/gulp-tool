module.exports = {
  debug: false, // debug 模式下不压缩代码、静态资源不添加版本号
  browserSync: {
    ui: false, //完全禁用 UI
    serveStatic: ['src/'],
    server: {
      index: 'index.html' //静态服务器打开的首页面，可以根据需要配置
    },
    port: 3333,
    ghostMode: true, //关闭所有设备里同步 点击、滚动、表单数据
    open: true, //停止自动打开浏览器
    notify: false //禁止更新页面时浏览器窗口右上角的提示
    // reloadDebounce: 1000
  },
  html: {
    __open: true, // 是否开启 HTML 压缩
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
    removeComments: true, //清除HTML注释
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyCSS: true, //压缩页面CSS
    minifyJS: true, //压缩页面JS
    minifyURLs: true //压缩页面内URL
  },
  css: {
    px2rem: {
      __open: false, // 是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false
      remUnit: 75 //基准单元
    },
    autoprefixer: {
      __open: true, // 是否开启自动添加兼容前缀
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    base64: {
      __open: true, // 是否开启小图 base64 转码
      extensions: ['png'],
      maxImageSize: 1024, //小于 1kb 转成 base64
      debug: false
    },
    minify: {
      __open: true // 是否开启 css 压缩
    }
  },
  imagemin: {
    __open: true // 是否开启图片压缩
  },
  absolutePath: {
    __open: false, //是否开启相对路径转绝对路径
    buildRootPath: '' //输出的根目录（必须）
  },
  revision: {
    __open: true, //是否开启静态资源版本管理
    image: 'hash' // hash 模式，query 模式
  }
}
