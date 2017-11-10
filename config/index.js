const merge = require('merge')
const DefaultConfig = require('./_default')
const ProjectsConfig = require('./projects')

module.exports = merge.recursive(true, DefaultConfig, ProjectsConfig)
