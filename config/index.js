/* 定义项目名称 */
const PROJECT_NAME = 'pay';
/* 定义CSS预处理器，less或者sass。注意：此变量在task里有引用，不推荐修改变量名 */
const CSS_PREPROCESSOR = 'sass';

const optionsPx2rem = require('./_px2rem.js'),
  optionsBase64 = require('./_base64.js'),
  optionsPrefixer = require('./_autoprefixer.js'),
  optionsCssmin = require('./_cssmin.js'),
  optionsHtmlmin = require('./_htmlmin.js'),
  browserSync = require('./_browser-sync.js');


module.exports = {
  /*开发目录*/
  developmentPath: 'src',
  /*生产目录*/
  productionPath: 'dist',
  /*版本对照表存放目录*/
  versionPath: 'rev',
  /*项目名称*/
  projectName: PROJECT_NAME,
  /*CSS 预处理器，选择 less 或者 sass。注意：此变量在 task 里有引用，禁止使用其他变量名*/
  cssPreprocessor: CSS_PREPROCESSOR,
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
  browserSync: browserSync
};
