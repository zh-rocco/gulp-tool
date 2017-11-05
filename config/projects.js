const _currentProject = 'example', // string
  ProjectsConfig = {
    example: {
      debug: false,
      browserSync: { open: false },
      html: { __open: true },
      css: { px2rem: { __open: true } },
      revision: { __open: true }
    }
  }

module.exports = Object.assign({ _currentProject }, ProjectsConfig[_currentProject])
