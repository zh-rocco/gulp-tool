const path = require('path');

const
    rootPath = '/app/dist/',
    relativePath = {
        /*
         * 将 html 文件内的 ./assets/ 全部替换为 /app/dist/${projectName}/assets/
         * 将 html 文件内的 ./css/ 全部替换为 /app/dist/${projectName}/css/
         * ...
         */
        html: ['../common/libs/', './assets/', './css/', './img/', './lib/', './js/'],
        css: ['../assets/', '../img/'],
        js: []
    };

class utils {
    generateGulpReplaceTaskRegulation(projectName) {
        let result = {};
        /* 迭代 relativePath 内的 html、css、js */
        Object.keys(relativePath).map(function (item) {
            let type = {};
            type.usePrefix = false;
            type.patterns = [];
            relativePath[item].map(function (currentValue) {
                let obj = {};
                obj.match = currentValue;

                switch (item) {
                    case 'html':
                        obj.replacement = path.posix.join(rootPath, projectName, currentValue);
                        break;
                    case 'css':
                        obj.replacement = path.posix.join(rootPath, projectName, 'css', currentValue);
                        break;
                    case 'js':
                        obj.replacement = path.posix.join(rootPath, projectName, currentValue);
                        break;
                }

                type.patterns.push(obj);
            });
            result[item] = type;
        });
        return result;
    }
}

module.exports = new utils();
