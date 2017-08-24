const optionsPx2rem = require('./_px2rem'),
    optionsBase64 = require('./_base64'),
    optionsPrefixer = require('./_autoprefixer'),
    optionsCssmin = require('./_cssmin'),
    optionsHtmlmin = require('./_htmlmin'),
    browserSync = require('./_browser-sync'),
    optionsImagemin = require('./_imagemin'),
    optionsPath = require('./_path')

module.exports = {
    /*项目名称*/
    projectName: 'family-sms',
    /*控制 build 时是否压缩 html、css、js，DEBUG = true 不压缩*/
    debug: false,
    /*是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false*/
    optionsPx2rem,
    /*小图片转 base64*/
    optionsBase64,
    /*CSS 自动添加前缀*/
    optionsPrefixer,
    /*CSS 压缩*/
    optionsCssmin,
    /*HTML 压缩*/
    optionsHtmlmin,
    /*浏览器自动更新*/
    browserSync,
    /*image 版本管理*/
    optionsImagemin,
    /*构建时路径处理*/
    optionsPath
}
