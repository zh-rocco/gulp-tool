const _currentProject = 'family-cloud-gd', // string
  ProjectsConfig = {
    example: {
      debug: false,
      browserSync: { open: false },
      html: { __open: true },
      css: { px2rem: { __open: true } },
      revision: { __open: true }
    },
    'family-cloud-gd': {
      debug: true,
      browserSync: {
        server: {
          index: 'web.html' //静态服务器打开的首页面，可以根据需要配置
        }
      },
      css: {
        minify: { __open: false },
        autoprefixer: { browsers: ['Android >= 4.0', 'iOS >= 7', 'last 5 versions'] }
      }
    }
  }

module.exports = Object.assign({ _currentProject }, ProjectsConfig[_currentProject])