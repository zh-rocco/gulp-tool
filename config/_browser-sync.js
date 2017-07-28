/* 详细配置：https://browsersync.io/docs/options */

module.exports = {
    port: 3333,
    ui: {
        port: 3334,
        weinre: {
            port: 3335
        }
    },
    /*proxy: {
        target: "http://home.cloud.189.cn",
    },*/
    serveStatic: ['src/'],
    server: {
        index: 'index.html' //静态服务器打开的首页面，可以根据需要配置
    },
    notify: false //禁止更新页面时浏览器窗口右上角的提示
};
