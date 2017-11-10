const _currentProject = 'family-sms-guangxi', // string
  ProjectsConfig = {
    example: {
      debug: false,
      browserSync: {
        server: {
          index: 'customIndex.html' //静态服务器打开的首页面，可以根据需要配置
        },
        open: false //停止自动打开浏览器
      },
      css: {
        px2rem: {
          __open: true // 是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false
        },
        autoprefixer: {
          browsers: ['Android >= 4.0']
        }
      }
    },
    'family-cloud-gd': {
      debug: true,
      browserSync: {
        server: {
          index: 'web.html' //静态服务器打开的首页面，可以根据需要配置
        }
      },
      css: {
        autoprefixer: { browsers: ['Android >= 4.0', 'iOS >= 7', 'ie >= 9'] }
      }
    },
    'family-sms-guangxi': {
      debug: false,
      css: {
        autoprefixer: { browsers: ['Android >= 4.0', 'iOS >= 7'] }
      }
    }
  }

module.exports = Object.assign({ _currentProject }, ProjectsConfig[_currentProject])
