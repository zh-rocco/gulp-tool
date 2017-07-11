/* 详细配置：https://github.com/jakubpawlowicz/clean-css */

module.exports = {
    compatibility: '*', //类型：String 默认：'*' [启用兼容模式； 'ie7'：IE7+兼容模式，'ie8'：IE8+兼容模式，'ie9'：IE9+兼容模式，'*'：IE10+兼容模式]
    specialComments: '*' //保留所有特殊前缀 当你用 autoprefixer 生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
};
