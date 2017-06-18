module.exports = {
  /*详细配置：https://browsersync.io/docs/options*/
  port: 3333,
  ui: {
    port: 3334,
    weinre: {
      port: 3335
    }
  },
  server: {
    /*静态服务器打开的首页面*/
    index: 'index.html'
  },
  /*禁止更新页面时浏览器窗口右上角的提示*/
  notify: false
};
