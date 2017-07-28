const optionsPx2rem = require('./_px2rem.js'),
    optionsBase64 = require('./_base64.js'),
    optionsPrefixer = require('./_autoprefixer.js'),
    optionsCssmin = require('./_cssmin.js'),
    optionsHtmlmin = require('./_htmlmin.js'),
    browserSync = require('./_browser-sync.js'),
    optionsImagemin = require('./_imagemin.js');

module.exports = {
    /*项目名称*/
    projectName: 'ecloud-6',
    /*控制 build 时是否压缩 html、css、js，DEBUG = true 不压缩*/
    debug: true,
    /*是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false*/
    optionsPx2rem: optionsPx2rem,
    /*小图片转 base64*/
    optionsBase64: optionsBase64,
    /*CSS 自动添加前缀*/
    optionsPrefixer: optionsPrefixer,
    /*CSS 压缩*/
    optionsCssmin: optionsCssmin,
    /*HTML 压缩*/
    optionsHtmlmin: optionsHtmlmin,
    /*浏览器自动更新*/
    browserSync: browserSync,
    /*image 版本管理*/
    optionsImagemin: optionsImagemin
};
