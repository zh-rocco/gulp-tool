const Options = require('./config/index')
const PROJECT_NAME = Options._currentProject
const DEBUG_FLAG = Options.debug
const REV_FLAG = !DEBUG_FLAG && Options.revision.__open

console.log(Options)

/* 基础 */
const merge = require('merge') // 对象合并
const gulp = require('gulp')
const path = require('path')
const browserSync = require('browser-sync') // 浏览器自动刷新
const sourcemaps = require('gulp-sourcemaps')
const runSequence = require('run-sequence') // 顺序执行
const gulpIf = require('gulp-if') // gulp 内 if 判断
const clean = require('gulp-clean') // 删除文件夹
const replace = require('gulp-replace') // 字符串替换
/* HTML处理 */
const htmlmin = require('gulp-htmlmin') // 压缩 HTML
/* CSS处理 */
const sass = require('gulp-sass')
const base64 = require('gulp-base64') // 图片 base64 转码
const postcss = require('gulp-postcss') // CSS 后处理器
const px2rem = require('postcss-px2rem') // px -> rem，配合 flexible.js 使用
const autoprefixer = require('autoprefixer') // 为 CSS 添加浏览器私有前缀
const cssnano = require('cssnano')
/* JS处理 */
const babel = require('gulp-babel') // ES6 -> ES5
const uglify = require('gulp-uglify') // 压缩 JS
/* 图片压缩 */
const cache = require('gulp-cache') // 缓存管理，提高图片第二次压缩的速度
const imagemin = require('gulp-imagemin') // 压缩图片
const imageminPngquant = require('imagemin-pngquant') // imagemin 插件
const imageminJpegRecompress = require('imagemin-jpeg-recompress') // imagemin 插件
/* 版本管理 */
const rev = require('gulp-rev') // 增加版本号
const revCollector = require('gulp-rev-collector') // 配合 gulp-rev 使用

/* 静态服务器 */
gulp.task('browser-sync', () => {
  const browserSyncOpt = merge.recursive(true, Options.browserSync, { server: { baseDir: `src/${PROJECT_NAME}/` } })
  return browserSync.init(browserSyncOpt)
})

/* 编译CSS，SASS --> CSS */
gulp.task('css', () => {
  let devProcessors = [autoprefixer(Options.css.autoprefixer)]
  if (Options.css.px2rem.__open) devProcessors.unshift(px2rem(Options.css.px2rem))

  let buildProcessors = [...devProcessors]
  if (!DEBUG_FLAG) buildProcessors.push(cssnano({ zindex: false }))

  return gulp
    .src([`src/${PROJECT_NAME}/scss/*.scss`, `!src/${PROJECT_NAME}/scss/_*.scss`])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpIf(Options.css.base64.__open, base64(Options.css.base64)))
    .pipe(gulpIf(process.env.NODE_ENV === 'production', postcss(buildProcessors), postcss(devProcessors)))
    .pipe(gulp.dest(`src/${PROJECT_NAME}/css`))
})

/* 监听 scss 文件夹下的 *.scss 文件变化，然后执行 css:dev 命令 */
gulp.task('watch:css', ['css'], () => {
  gulp.watch([`src/${PROJECT_NAME}/scss/**/*.scss`, `src/common/scss/**/*.scss`], ['css'])
})

/* 开发任务 */
gulp.task('dev', ['watch:css', 'browser-sync'], () => {
  return gulp
    .watch([`src/${PROJECT_NAME}/**/*.html`, `src/${PROJECT_NAME}/**/*.css`, `src/${PROJECT_NAME}/**/*.js`])
    .on('change', browserSync.reload)
})

/*-*/
/*----- 分割线（上：开发阶段；下：发布阶段） -----*/
/*-*/

/* 图片压缩 */
gulp.task('build:image', () => {
  // 附加插件，修复 jpeg 图片无法压缩，插件需要以数组的形式传入，不可使用对象
  // 详情请阅读gulp-imagemin源码：https://github.com/sindresorhus/gulp-imagemin/blob/master/index.js
  const pluginsImagemin = [imageminPngquant(), imageminJpegRecompress()]

  return gulp
    .src(`src/${PROJECT_NAME}/img/**/*.+(png|jpg|jpeg|gif|svg)`)
    .pipe(gulpIf(!DEBUG_FLAG && Options.imagemin.__open, cache(imagemin(pluginsImagemin))))
    .pipe(gulpIf(REV_FLAG, rev()))
    .pipe(gulp.dest(`dist/${PROJECT_NAME}/img`))
    .pipe(gulpIf(REV_FLAG, rev.manifest()))
    .pipe(gulpIf(REV_FLAG, gulp.dest(`rev/${PROJECT_NAME}/img`)))
})

/* 复制静态资源，如：assets、lib 等 */
gulp.task('build:copy', () => {
  const sourceFiles = [
    `src/common/**/*`,
    `!src/common/scss`,
    `!src/common/scss/**/*`,
    `src/${PROJECT_NAME}/assets/**/*`,
    `src/${PROJECT_NAME}/lib/**/*`
  ]
  return gulp.src(sourceFiles, { base: `src` }).pipe(gulp.dest(`dist`))
})

/* 压缩 CSS、增加版本号 */
gulp.task('build:css', ['css'], () => {
  return gulp
    .src([`rev/${PROJECT_NAME}/**/*.json`, `src/${PROJECT_NAME}/css/**/*.css`, `!src/${PROJECT_NAME}/css/**/*.min.css`])
    .pipe(
      gulpIf(
        Options.absolutePath.__open,
        replace(/\.{1,2}\/(img|assets)/gi, match => {
          return path.posix.join(Options.absolutePath.buildRootPath, PROJECT_NAME, 'css', match)
        })
      )
    )
    .pipe(gulpIf(REV_FLAG, revCollector()))
    .pipe(gulpIf(REV_FLAG, rev()))
    .pipe(gulp.dest(`dist/${PROJECT_NAME}/css`))
    .pipe(gulpIf(REV_FLAG, rev.manifest()))
    .pipe(gulpIf(REV_FLAG, gulp.dest(`rev/${PROJECT_NAME}/css`)))
})

/* 压缩 JS、增加版本号 */
gulp.task('build:js', () => {
  return gulp
    .src([`rev/${PROJECT_NAME}/**/*.json`, `src/${PROJECT_NAME}/js/**/*.js`, `!src/${PROJECT_NAME}/js/**/*.min.js`])
    .pipe(
      gulpIf(
        Options.absolutePath.__open,
        replace(/\.{1,2}\/(img|assets)/gi, match => {
          return path.posix.join(Options.absolutePath.buildRootPath, PROJECT_NAME, 'js', match)
        })
      )
    )
    .pipe(gulpIf(REV_FLAG, revCollector()))
    .pipe(babel())
    .pipe(gulpIf(!DEBUG_FLAG, uglify()))
    .pipe(gulpIf(REV_FLAG, rev()))
    .pipe(gulp.dest(`dist/${PROJECT_NAME}/js`))
    .pipe(gulpIf(REV_FLAG, rev.manifest()))
    .pipe(gulpIf(REV_FLAG, gulp.dest(`rev/${PROJECT_NAME}/js`)))
})

/* 压缩HTML，CSS、JS更改文件名 */
gulp.task('build:html', () => {
  return gulp
    .src([`rev/${PROJECT_NAME}/**/*.json`, `src/${PROJECT_NAME}/*.html`])
    .pipe(
      gulpIf(
        Options.absolutePath.__open,
        replace(/\.{1,2}\/(common|css|img|assets|js)/gi, match => {
          return path.posix.join(Options.absolutePath.buildRootPath, PROJECT_NAME, match)
        })
      )
    )
    .pipe(gulpIf(REV_FLAG, revCollector()))
    .pipe(gulpIf(!DEBUG_FLAG, htmlmin(Options.html)))
    .pipe(gulp.dest(`dist/${PROJECT_NAME}`))
})

/* 执行 build 前清理发布文件夹 */
gulp.task('clean', () => {
  return gulp.src([`dist/${PROJECT_NAME}`, `rev/${PROJECT_NAME}`], { read: false }).pipe(clean())
})
/* 同时删除图片缓存 */
gulp.task('clean:cache', () => {
  cache.clearAll()
  return gulp.src([`dist/${PROJECT_NAME}`, `rev/${PROJECT_NAME}`], { read: false }).pipe(clean())
})

/* 发布任务 */
gulp.task('build', () => {
  runSequence('clean', ['build:copy', 'build:image'], ['build:css', 'build:js'], 'build:html')
})
