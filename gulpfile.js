let gulp = require('gulp'),
    clean = require('gulp-clean'), //删除文件夹
    del = require('del'), //删除文件夹
    concat = require('gulp-concat'), //合并文件
    rename = require('gulp-rename'), //改名
    plumber = require('gulp-plumber'), //处理管道崩溃问题
    notify = require('gulp-notify'), //报错与不中断当前任务
    cache = require('gulp-cache'), //缓存管理，提高图片第二次压缩的速度
    //gulpIf = require('gulp-if'), //gulp内if判断
    runSequence = require('run-sequence'),  // 顺序执行
    browserSync = require('browser-sync'), //浏览器自动刷新

    /* HTML处理 */
    htmlmin = require('gulp-htmlmin'), //压缩HTML

    /* CSS处理 */
    less = require('gulp-less'), //LESS --> CSS
    sass = require('gulp-sass'), //SASS --> CSS
    compass = require('gulp-compass'), //配合SASS使用
    autoprefixer = require('gulp-autoprefixer'), //为CSS添加浏览器私有前缀
    cssmin = require('gulp-clean-css'), //压缩CSS

    /* JS处理 */
    jshint = require('gulp-jshint'), //JS校验，依赖jshint
    uglify = require('gulp-uglify'), //压缩JS

    /* 图片处理 */
    base64 = require('gulp-base64'), //图片base64转码
    imagemin = require('gulp-imagemin'), //压缩图片
    imageminPngquant = require('imagemin-pngquant'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),

    spriteSmith = require('gulp.spritesmith'), //合成雪碧图

    /* 版本管理 */
    cssUrlVersion = require('gulp-make-css-url-version'), //为CSS文件内的URL进行版本管理
    rev = require('gulp-rev'), //增加版本号
    revCollector = require('gulp-rev-collector'); //配合gulp-rev使用


/* 定义开发目录 */
const DEVELOPMENT_PATH = 'src';
/* 定义生产目录 */
const PRODUCTION_PATH = 'dist';
/* 定义版本对照表存放目录 */
const VERSION_PATH = 'rev';
/* 定义项目名称 */
const PROJECT_NAME = 'popup';
/* 定义CSS预处理器，less或者sass。注意：此变量在task里有引用，不推荐修改变量名 */
const CSS_PREPROCESSOR = 'less';

/* 全局路径管理 */
let G_PATH = {
    /*开发环境*/
    dev: {
        base: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/',
        html: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/',
        sass: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/sass/',
        less: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/less/',
        css: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/css/',
        js: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/js/',
        /*uploads*/
        image: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/img/',
        sprite: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/sprite/',
        fonts: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/fonts/',
        lib: DEVELOPMENT_PATH + '/' + PROJECT_NAME + '/lib/'
    },
    /*发布环境*/
    dist: {
        base: PRODUCTION_PATH + '/' + PROJECT_NAME + '/',
        html: PRODUCTION_PATH + '/' + PROJECT_NAME + '/',
        css: PRODUCTION_PATH + '/' + PROJECT_NAME + '/css/',
        js: PRODUCTION_PATH + '/' + PROJECT_NAME + '/js/',
        image: PRODUCTION_PATH + '/' + PROJECT_NAME + '/img/',
        fonts: PRODUCTION_PATH + '/' + PROJECT_NAME + '/fonts/'
    },
    /*版本对照表存放目录*/
    rev: {
        base: VERSION_PATH + '/' + PROJECT_NAME + '/',
        css: VERSION_PATH + '/' + PROJECT_NAME + '/css/',
        js: VERSION_PATH + '/' + PROJECT_NAME + '/js/'
    }
};


/* ----- 开发阶段 ----- */
/*
 * 合成雪碧图
 * 需要合并的PNG文件放在 G_PATH.dev.sprite 目录下
 * 合并后的PNG和生成的CSS文件输出到 G_PATH.dev.sprite/merge 目录
 * */
gulp.task('sprite', function () {
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
gulp.task('browser-sync', function () {
    browserSync.init({
        /*详细配置：https://browsersync.io/docs/options*/
        port: 3333,
        ui: {
            port: 3334,
            weinre: {
                port: 3335
            }
        },
        server: {
            baseDir: G_PATH.dev.base,
            /*静态服务器打开的首页面*/
            index: 'index.html'
        },
        /*禁止更新页面时浏览器窗口右上角的提示*/
        notify: false
    });
});

/* 编译CSS */
let optionsBase64 = {
    /*详细配置：https://www.npmjs.com/package/gulp-base64*/
    extensions: ['png'],
    maxImageSize: 5 * 1024, //小于5kb
    debug: false
};
let optionsPrefixer = {
    /*详细配置：https://github.com/postcss/autoprefixer#options*/
    browsers: ['Android >= 4.0', 'iOS >= 7', 'ie >= 9']
};
/* LESS --> CSS */
gulp.task('less', function () {
    return gulp.src([G_PATH.dev.less + '*.less', '!src' + G_PATH.dev.less + 'base.less'])
    /*如果less文件中有语法错误，用plumber保证任务不会停止*/
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>;')
        }))
        .pipe(less())
        .pipe(base64(optionsBase64))
        .pipe(autoprefixer(optionsPrefixer))
        .pipe(gulp.dest(G_PATH.dev.css));
});
/* SASS --> CSS */
gulp.task('sass', function () {
    return gulp.src([G_PATH.dev.sass + '*.scss', '!src' + G_PATH.dev.sass + 'base.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(base64(optionsBase64))
        .pipe(autoprefixer(optionsPrefixer))
        .pipe(gulp.dest(G_PATH.dev.css));
});

/* 监听less文件夹下的*.less文件变化，然后执行less命令 */
gulp.task('watch:less', ['less'], function () {
    gulp.watch(G_PATH.dev.less + '*.less', ['less']);
});

/* 监听sass文件夹下的*.scss文件变化，然后执行sass命令 */
gulp.task('watch:sass', ['sass'], function () {
    gulp.watch(G_PATH.dev.sass + '*.scss', ['sass']);
});

/*监听开发目录下的所有*.less *.scss *.css *.js *.html文件变化，然后自动刷新浏览器*/
gulp.task('watch:browser', [CSS_PREPROCESSOR, 'browser-sync'], function () {
    /*调用上面定义的less或sass*/
    gulp.watch(G_PATH.dev[CSS_PREPROCESSOR] + '/*.' + CSS_PREPROCESSOR.replace('sass', 'scss'), [CSS_PREPROCESSOR]);
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
gulp.task('image', function () {
    /*附加插件，修复jpeg图片无法压缩，插件需要以数组的形式传入，不可使用对象*/
    /*详情请阅读gulp-imagemin源码：https://github.com/sindresorhus/gulp-imagemin/blob/master/index.js*/
    let pluginsImagemin = [
        imageminPngquant(),
        imageminJpegRecompress()
    ];
    return gulp.src(G_PATH.dev.image + '**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin(pluginsImagemin)))
        .pipe(gulp.dest(G_PATH.dist.image));
});

/*
 * 复制静态资源
 * 如：fonts、lib等
 * */
gulp.task('copy', function () {
    let sourceFiles = [G_PATH.dev.fonts + '**/*', G_PATH.dev.lib + '**/*'];
    let destination = G_PATH.dist.base;
    return gulp.src(sourceFiles, {base: G_PATH.dev.base})
        .pipe(gulp.dest(destination));
});

/* 压缩CSS、增加版本号 */
gulp.task('css', function () {
    let optionsCssmin = {
        /*详细配置：https://github.com/jakubpawlowicz/clean-css*/
        compatibility: '*', //类型：String 默认：'*' [启用兼容模式； 'ie7'：IE7+兼容模式，'ie8'：IE8+兼容模式，'ie9'：IE9+兼容模式，'*'：IE10+兼容模式]
        specialComments: '*' //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    };
    return gulp.src(G_PATH.dev.css + '*.css')
        .pipe(cssmin(optionsCssmin))
        .pipe(cssUrlVersion()) //给css文件里引用文件加版本号（文件MD5）
        .pipe(rev())
        .pipe(gulp.dest(G_PATH.dist.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(G_PATH.rev.css));
});

/* 压缩JS、增加版本号 */
gulp.task('js', function () {
    let optionsUglify = {
        /*删除 console 语句*/
        drop_debugger: false
    };

    return gulp.src(G_PATH.dev.js + '*.js')
        .pipe(jshint())
        .pipe(uglify(optionsUglify))
        .pipe(rev())
        .pipe(gulp.dest(G_PATH.dist.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(G_PATH.rev.js));
});

/* 压缩HTML、CSS、JS更改文件名 */
gulp.task('html', function () {
    let optionsHtmlmin = {
        /*详细配置：https://github.com/kangax/html-minifier*/
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeComments: true, //清除HTML注释
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyCSS: true, //压缩页面CSS
        minifyJS: true, //压缩页面JS
        minifyURLs: true //压缩页面内URL
    };
    return gulp.src([G_PATH.rev.base + '**/*.json', G_PATH.dev.base + '*.html'])
        .pipe(revCollector())
        .pipe(htmlmin(optionsHtmlmin))
        .pipe(gulp.dest(G_PATH.dist.base));
});

/* 执行build前清理发布文件夹 */
gulp.task('clean', function () {
    //del(PRODUCTION_PATH);
    //return cache.clearAll();
    cache.clearAll();
    return gulp.src([G_PATH.dist.base, G_PATH.rev.base], {read: false})
        .pipe(clean())
});
gulp.task('clean:dist', function () {
    del([G_PATH.dist.base + '**/*', '!' + G_PATH.dist.image, '!' + G_PATH.dist.image + '**/*']);
});

/* 发布任务 */
gulp.task('build', function () {
    runSequence(
        'clean',
        [CSS_PREPROCESSOR, 'image', 'copy'],
        ['css', 'js'],
        'html')
});