/* 详细配置：https://github.com/kangax/html-minifier */

module.exports = {
  collapseWhitespace: true, //压缩HTML
  collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
  removeComments: true, //清除HTML注释
  removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
  removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
  removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
  minifyCSS: true, //压缩页面CSS
  minifyJS: true, //压缩页面JS
  minifyURLs: true //压缩页面内URL
};
