const Config = require('./config/index.js');

/* 定义项目名称 */
const PROJECT_NAME = Config.projectName;
/* 定义CSS预处理器，less或者sass。注意：此变量在task里有引用，不要修改变量名 */
const CSS_PREPROCESSOR = Config.cssPreprocessor;
/* 定义开发目录 */
const DEVELOPMENT_PATH = Config.developmentPath || 'src';
/* 定义生产目录 */
const PRODUCTION_PATH = Config.productionPath || 'dist';
/* 定义版本对照表存放目录 */
const VERSION_PATH = Config.versionPath || 'rev';

/* 全局路径管理 */
const G_PATH = {
  /*开发环境*/
  dev: {
    base: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/',
    less: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/less/',
    sass: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/sass/',
    css: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/css/',
    js: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/js/',
    image: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/img/',
    sprite: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/sprite/',
    fonts: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/fonts/',
    lib: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/lib/'
  },
  /*发布环境*/
  dist: {
    base: PRODUCTION_PATH + '/' + PROJECT_NAME + '/',
    css: PRODUCTION_PATH + '/' + PROJECT_NAME + '/css/',
    js: PRODUCTION_PATH + '/' + PROJECT_NAME + '/js/',
    image: PRODUCTION_PATH + '/' + PROJECT_NAME + '/img/',
    fonts: PRODUCTION_PATH + '/' + PROJECT_NAME + '/fonts/'
  },
  /*版本对照表存放目录*/
  rev: {
    base: VERSION_PATH + '/' + PROJECT_NAME + '/',
    css: VERSION_PATH + '/' + PROJECT_NAME + '/css/',
    js: VERSION_PATH + '/' + PROJECT_NAME + '/js/',
    image: VERSION_PATH + '/' + PROJECT_NAME + '/image/'
  }
};


/* 插件列表 */
let gulp = require('gulp'),
  clean = require('gulp-clean'), //删除文件夹
  concat = require('gulp-concat'), //合并文件
  rename = require('gulp-rename'), //改名
  plumber = require('gulp-plumber'), //处理管道崩溃问题
  notify = require('gulp-notify'), //报错与不中断当前任务
  cache = require('gulp-cache'), //缓存管理，提高图片第二次压缩的速度
  gulpIf = require('gulp-if'), //gulp 内 if 判断
  runSequence = require('run-sequence'),  //顺序执行
  browserSync = require('browser-sync'), //浏览器自动刷新

  /* HTML处理 */
  htmlmin = require('gulp-htmlmin'), //压缩HTML

  /* CSS处理 */
  less = require('gulp-less'), //LESS --> CSS
  sass = require('gulp-sass'), //SASS --> CSS
  autoprefixer = require('gulp-autoprefixer'), //为CSS添加浏览器私有前缀
  cssmin = require('gulp-clean-css'), //压缩CSS
  postcss = require('gulp-postcss'), //postcss-px2rem 依赖
  px2rem = require('postcss-px2rem'), //px -> rem，配合 flexible.js 使用

  /* JS处理 */
  jshint = require('gulp-jshint'), //JS校验，依赖jshint
  babel = require("gulp-babel"), //ES6 -> ES5
  uglify = require('gulp-uglify'), //压缩JS

  /* 图片处理 */
  base64 = require('gulp-base64'), //图片 base64 转码
  imagemin = require('gulp-imagemin'), //压缩图片
  imageminPngquant = require('imagemin-pngquant'), //imagemin 插件
  imageminJpegRecompress = require('imagemin-jpeg-recompress'), //imagemin 插件

  spriteSmith = require('gulp.spritesmith'), //合成雪碧图

  /* 版本管理 */
  //cssUrlVersion = require('gulp-make-css-url-version'), //为CSS文件内的URL进行版本管理
  rev = require('gulp-rev'), //增加版本号
  revCollector = require('gulp-rev-collector'); //配合 gulp-rev 使用


/* ----- 开发阶段 ----- */
/*
 * 合成雪碧图
 * 需要合并的PNG文件放在 G_PATH.dev.sprite 目录下
 * 合并后的PNG和生成的CSS文件输出到 G_PATH.dev.sprite/merge 目录
 * */
gulp.task('sprite', () => {
  return gulp.src(G_PATH.dev.sprite + '**/*.png')
    .pipe(spriteSmith({
      /*详细配置：https://www.npmjs.com/package/gulp.spritesmith*/
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      padding: 5
    }))
    .pipe(gulp.dest(G_PATH.dev.sprite + 'merge'));
});

/* 静态服务器 */
let browserSyncOpt = Object.assign(Config.browserSync, {server: {baseDir: G_PATH.dev.base}});
gulp.task('browser-sync', () => {
  browserSync.init(browserSyncOpt);
});

/* 编译CSS */
let processors = [px2rem({remUnit: Config.optionsPx2rem.remUnit})];
/* LESS --> CSS */
gulp.task('less', () => {
  return gulp.src([G_PATH.dev.less + '*.less', '!' + G_PATH.dev.less + '_' + '*.less'])
  /*如果less文件中有语法错误，用plumber保证任务不会停止*/
    .pipe(plumber())
    .pipe(less())
    .pipe(gulpIf(Config.optionsPx2rem.open, postcss(processors)))
    .pipe(base64(Config.optionsBase64))
    .pipe(autoprefixer(Config.optionsPrefixer))
    .pipe(gulp.dest(G_PATH.dev.css));
});
/* SASS --> CSS */
gulp.task('sass', function () {
  return gulp.src([G_PATH.dev.sass + '*.scss', '!src' + G_PATH.dev.sass + 'base.scss'])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpIf(Config.optionsPx2rem.open, postcss(processors)))
    .pipe(base64(Config.optionsBase64))
    .pipe(autoprefixer(Config.optionsPrefixer))
    .pipe(gulp.dest(G_PATH.dev.css));
});

/* 监听less文件夹下的*.less文件变化，然后执行less命令 */
gulp.task('watch:less', ['less'], () => {
  gulp.watch(G_PATH.dev.less + '*.less', ['less']);
});
/* 监听sass文件夹下的*.scss文件变化，然后执行sass命令 */
gulp.task('watch:sass', ['sass'], function () {
  gulp.watch(G_PATH.dev.sass + '*.scss', ['sass']);
});

/*监听开发目录下的所有*.less *.scss *.css *.js *.html文件变化，然后自动刷新浏览器*/
gulp.task('watch:browser', [CSS_PREPROCESSOR, 'browser-sync'], () => {
  /*调用上面定义的less或sass*/
  gulp.watch(G_PATH.dev[CSS_PREPROCESSOR] + '*.' + CSS_PREPROCESSOR.replace('sass', 'scss'), [CSS_PREPROCESSOR]);
  /*通过 browserSync 控制浏览器自动刷新*/
  let reload = browserSync.reload;
  gulp.watch(G_PATH.dev.css + '*.css').on('change', reload);
  gulp.watch(G_PATH.dev.js + '*.js').on('change', reload);
  gulp.watch(G_PATH.dev.base + '*.html').on('change', reload);
});


/*-*/
/*----- 分割线（上：部署开发阶段；下：部署发布阶段） -----*/
/*-*/


/* ----- 发布阶段 ----- */
/* 图片压缩 */
gulp.task('image', () => {
  /*附加插件，修复jpeg图片无法压缩，插件需要以数组的形式传入，不可使用对象*/
  /*详情请阅读gulp-imagemin源码：https://github.com/sindresorhus/gulp-imagemin/blob/master/index.js*/
  let pluginsImagemin = [
    imageminPngquant(),
    imageminJpegRecompress()
  ];
  return gulp.src(G_PATH.dev.image + '**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin(pluginsImagemin)))
    .pipe(rev())
    .pipe(gulp.dest(G_PATH.dist.image))
    .pipe(rev.manifest())
    .pipe(gulp.dest(G_PATH.rev.image));
});

/*
 * 复制静态资源
 * 如：fonts、lib等
 * */
gulp.task('copy', () => {
  let sourceFiles = [G_PATH.dev.fonts + '**/*', G_PATH.dev.lib + '**/*'];
  let destination = G_PATH.dist.base;
  return gulp.src(sourceFiles, {base: G_PATH.dev.base})
    .pipe(gulp.dest(destination));
});

/* 压缩CSS、增加版本号 */
gulp.task('css', () => {
  return gulp.src([G_PATH.rev.base + '**/*.json', G_PATH.dev.css + '*.css'])
    .pipe(revCollector())
    .pipe(cssmin(Config.optionsCssmin))
    //.pipe(cssUrlVersion()) //给css文件里引用文件加版本号（文件MD5）
    .pipe(rev())
    .pipe(gulp.dest(G_PATH.dist.css))
    .pipe(rev.manifest())
    .pipe(gulp.dest(G_PATH.rev.css));
});

/* 压缩JS、增加版本号 */
gulp.task('js', () => {
  return gulp.src(G_PATH.dev.js + '*.js')
    .pipe(jshint())
    .pipe(babel())
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(G_PATH.dist.js))
    .pipe(rev.manifest())
    .pipe(gulp.dest(G_PATH.rev.js));
});

/* 压缩HTML、CSS、JS更改文件名 */
gulp.task('html', () => {
  return gulp.src([G_PATH.rev.base + '**/*.json', G_PATH.dev.base + '*.html'])
    .pipe(revCollector())
    .pipe(htmlmin(Config.optionsHtmlmin))
    .pipe(gulp.dest(G_PATH.dist.base));
});

/* 执行build前清理发布文件夹 */
gulp.task('clean', () => {
  return gulp.src([G_PATH.dist.base, G_PATH.rev.base], {read: false})
    .pipe(clean())
});
/* 同时删除图片缓存 */
gulp.task('clean:all', () => {
  cache.clearAll();
  return gulp.src([G_PATH.dist.base, G_PATH.rev.base], {read: false})
    .pipe(clean())
});

/* 发布任务 */
gulp.task('build', () => {
  runSequence(
    'clean',
    [CSS_PREPROCESSOR, 'image', 'copy'],
    ['css', 'js'],
    'html')
});

gulp.task('build:clean', () => {
  runSequence(
    'clean:all',
    [CSS_PREPROCESSOR, 'image', 'copy'],
    ['css', 'js'],
    'html')
});
