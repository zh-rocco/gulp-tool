/* 说明：
 *
 * 替换规则参考：https://github.com/outatime/gulp-replace-task
 *
 * example 项目名称
 *    html 项目内所有 html 文件内需要替换的路径集
 *    css  项目内所有 css 文件内需要替换的路径集
 *    js   项目内所有 js 文件内需要替换的路径集
 *
 */

module.exports = {
    root: 'src/',
    build: 'app/dist/'
};

/*module.exports = {
    'example': {
        root: '/app/dist/example/',
        relativePath: {
            /!*
             * 将 html 文件内的 ./common/ 全部替换为 /app/dist/ecloud-6/common/
             * 将 html 文件内的 ./css/ 全部替换为 /app/dist/ecloud-6/css/
             * ...
             *!/
            html: ['./common/', './css/', './img/', './lib/', './js/'],
            css: ['../common/', '../img/'],
            js: []
        }
    },
    'ecloud-6': {
        root: '/app/dist/ecloud-6/',
        relativePath: {
            /!*
             * 将 html 文件内的 ./common/ 全部替换为 /app/dist/ecloud-6/common/
             * 将 html 文件内的 ./css/ 全部替换为 /app/dist/ecloud-6/css/
             * ...
             *!/
            html: ['./common/', './css/', './img/', './lib/', './js/'],
            css: ['../common/', '../img/'],
            js: ['./img/']
        }
    }
};*/
