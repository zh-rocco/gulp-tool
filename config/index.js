const merge = require('merge'),
  DefaultConfig = require('./_default'),
  ProjectsConfig = require('./projects')

module.exports = merge.recursive(true, DefaultConfig, ProjectsConfig)
