const
    Config = require('./config/index'),
    PROJECT_NAME = Config.projectName;

/* 插件列表 */
let gulp = require('gulp'),
    path = require('path'),
    clean = require('gulp-clean'), //删除文件夹
    concat = require('gulp-concat'), //合并文件
    rename = require('gulp-rename'), //改名
    plumber = require('gulp-plumber'), //处理管道崩溃问题
    cache = require('gulp-cache'), //缓存管理，提高图片第二次压缩的速度
    gulpIf = require('gulp-if'), //gulp 内 if 判断
    runSequence = require('run-sequence'),  //顺序执行
    browserSync = require('browser-sync'), //浏览器自动刷新
    replace = require('gulp-replace'), //字符串替换

    /* HTML处理 */
    htmlmin = require('gulp-htmlmin'), //压缩HTML

    /* CSS处理 */
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
    cssUrlVersion = require('gulp-make-css-url-version'), //为CSS文件内的URL进行版本管理
    rev = require('gulp-rev'), //增加版本号
    revCollector = require('gulp-rev-collector'); //配合 gulp-rev 使用


/* ----- 开发阶段 ----- */
/*
 * 合成雪碧图
 * 需要合并的PNG文件放在 ${PROJECT_NAME}/sprite 目录下
 * 合并后的PNG和生成的CSS文件输出到 ${PROJECT_NAME}/sprite/merge 目录
 * */
gulp.task('sprite', () => {
    return gulp.src(`src/${PROJECT_NAME}/**/*.png`, {base: `src`})
        .pipe(spriteSmith({
            /*详细配置：https://www.npmjs.com/package/gulp.spritesmith*/
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            padding: 5
        }))
        .pipe(gulp.dest(`src/${PROJECT_NAME}/merge`));
});

/* 静态服务器 */
let browserSyncOpt = Object.assign(Config.browserSync, {server: {baseDir: `src/${PROJECT_NAME}/`}});
gulp.task('browser-sync', () => {
    browserSync.init(browserSyncOpt);
});

/* 编译CSS，SASS --> CSS */
gulp.task('sass', () => {
    let processors = [px2rem({remUnit: Config.optionsPx2rem.remUnit})];
    return gulp.src([`src/${PROJECT_NAME}/sass/*.scss`, `!src/${PROJECT_NAME}/sass/_*.scss`])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulpIf(Config.optionsPx2rem.open, postcss(processors)))
        .pipe(base64(Config.optionsBase64))
        .pipe(autoprefixer(Config.optionsPrefixer))
        .pipe(gulp.dest(`src/${PROJECT_NAME}/css`));
});

/* 监听sass文件夹下的*.scss文件变化，然后执行sass命令 */
gulp.task('watch:sass', ['sass'], () => {
    gulp.watch([`src/${PROJECT_NAME}/sass/*.scss`, `src/common/sass/*.scss`], ['sass']);
});

/*监听开发目录下的所有*.less *.scss *.css *.js *.html文件变化，然后自动刷新浏览器*/
gulp.task('watch:browser', ['sass', 'browser-sync'], () => {
    /*调用上面定义的 less 或 sass */
    gulp.watch([`src/${PROJECT_NAME}/sass/*.scss`, `src/common/sass/*.scss`], ['sass']);
    /*通过 browserSync 控制浏览器自动刷新*/
    gulp.watch([`src/${PROJECT_NAME}/*.html`, `src/${PROJECT_NAME}/css/*.css`, `src/${PROJECT_NAME}/js/*.js`]).on('change', browserSync.reload);
});


/*-*/
/*----- 分割线（上：部署开发阶段；下：部署发布阶段） -----*/
/*-*/


/* ----- 发布阶段 ----- */
const imageRevFlag = Config.optionsImagemin.type === 0;
const pathRegex = Config.optionsPath;

/* 图片压缩 */
gulp.task('image', () => {
    /*附加插件，修复 jpeg 图片无法压缩，插件需要以数组的形式传入，不可使用对象*/
    /*详情请阅读gulp-imagemin源码：https://github.com/sindresorhus/gulp-imagemin/blob/master/index.js*/
    let pluginsImagemin = [
        imageminPngquant(),
        imageminJpegRecompress()
    ];
    return gulp.src(`src/${PROJECT_NAME}/img/*.+(png|jpg|jpeg|gif|svg)`)
        .pipe(cache(imagemin(pluginsImagemin)))
        .pipe(gulpIf(imageRevFlag, rev()))
        .pipe(gulp.dest(`dist/${PROJECT_NAME}/img`))
        .pipe(gulpIf(imageRevFlag, rev.manifest()))
        .pipe(gulpIf(imageRevFlag, gulp.dest(`rev/${PROJECT_NAME}/img`)));
});

/*
 * 复制静态资源
 * 如：fonts、lib等
 * */
gulp.task('copy', () => {
    const sourceFiles = [`src/common/**/*`, `!src/common/sass`, `!src/common/sass/**/*`, `src/${PROJECT_NAME}/assets/**/*`];
    return gulp.src(sourceFiles, {base: `src`})
        .pipe(gulp.dest(`dist`));
});

/* 压缩CSS、增加版本号 */
gulp.task('css', () => {
    return gulp.src([`rev/${PROJECT_NAME}/**/*.json`, `src/${PROJECT_NAME}/css/*.css`, `!src/${PROJECT_NAME}/css/*.min.css`])
        .pipe(replace(/\.{1,2}\/(img|assets)/ig, match => {
            return path.posix.join(pathRegex.buildRootPath, PROJECT_NAME, 'css', match);
        }))
        .pipe(revCollector())
        .pipe(gulpIf(!Config.debug, cssmin(Config.optionsCssmin)))
        .pipe(gulpIf(!imageRevFlag, cssUrlVersion())) //给css文件里引用文件加版本号（文件MD5）
        .pipe(rev())
        .pipe(gulp.dest(`dist/${PROJECT_NAME}/css`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`rev/${PROJECT_NAME}/css`));
});

/* 压缩JS、增加版本号 */
gulp.task('js', () => {
    return gulp.src(`src/${PROJECT_NAME}/js/*.js`)
        .pipe(jshint())
        .pipe(babel())
        .pipe(gulpIf(!Config.debug, uglify()))
        .pipe(rev())
        .pipe(gulp.dest(`dist/${PROJECT_NAME}/js`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`rev/${PROJECT_NAME}/js`));
});

/* 压缩HTML、CSS、JS更改文件名 */
gulp.task('html', () => {
    return gulp.src([`rev/${PROJECT_NAME}/**/*.json`, `src/${PROJECT_NAME}/*.html`])
        .pipe(replace(/\.{1,2}\/(common|css|img|assets|js)/ig, match => {
            return path.posix.join(pathRegex.buildRootPath, PROJECT_NAME, match);
        }))
        .pipe(revCollector())
        .pipe(gulpIf(!Config.debug, htmlmin(Config.optionsHtmlmin)))
        .pipe(gulp.dest(`dist/${PROJECT_NAME}`));
});

/* 执行build前清理发布文件夹 */
gulp.task('clean', () => {
    return gulp.src([`dist/${PROJECT_NAME}`, `rev/${PROJECT_NAME}`], {read: false})
        .pipe(clean())
});
/* 同时删除图片缓存 */
gulp.task('clean:all', () => {
    cache.clearAll();
    return gulp.src([`dist/${PROJECT_NAME}`, `rev/${PROJECT_NAME}`], {read: false})
        .pipe(clean())
});

/* 发布任务 */
gulp.task('build', () => {
    runSequence(
        'clean',
        ['sass', 'image', 'copy'],
        ['css', 'js'],
        'html')
});

gulp.task('build:clean', () => {
    runSequence(
        'clean:all',
        ['sass', 'image', 'copy'],
        ['css', 'js'],
        'html')
});
