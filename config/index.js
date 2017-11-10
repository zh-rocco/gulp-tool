const merge = require('merge')
const DefaultConfig = require('./_default')
const ProjectsConfig = require('./projects')

ProjectsConfig.browserSync.server.baseDir = `src/${ProjectsConfig._currentProject}/`

module.exports = merge.recursive(true, DefaultConfig, ProjectsConfig)
