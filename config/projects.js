const _currentProject = 'store'; // string, 当前构建项目
const ProjectsConfig = {
  example: {
    debug: false,
    browserSync: {
      server: {
        index: 'customIndex.html' //静态服务器打开的首页面，可以根据需要配置
      },
      open: false //停止自动打开浏览器
    },
    css: {
      autoprefixer: { browsers: ['Android >= 5.0', 'iOS >= 9'] },
      px2rem: { __open: false } // 是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false
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
  },
  huafei: {
    debug: true,
    browserSync: {
      open: false //停止自动打开浏览器
    },
    css: {
      px2rem: { __open: false } // 是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false
    }
  },
  galiao: {
    debug: false,
    browserSync: {
      open: false //停止自动打开浏览器
    },
    css: {
      px2rem: { __open: true } // 是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false
    },
    absolutePath: {
      __open: true, // 是否开启相对路径转绝对路径
      buildRootPath: '/app/dist/' // 输出的根目录（必须）
    }
  },
  'family-recommend': {
    browserSync: {
      open: false //停止自动打开浏览器
    }
  },
  huafei: {
    debug: true,
    autoprefixer: {
      browsers: ['iOS >= 10']
    },
    revision: {
      __open: false
    }
  }
};

module.exports = Object.assign(
  { _currentProject },
  ProjectsConfig[_currentProject]
);
