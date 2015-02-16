// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var _ = require('lodash');
	var Backbone = require('backbone');
	var Project = require('models/project');

	var Projects = Backbone.Collection.extend({
		model: Project,
		localStorage: new Backbone.LocalStorage('Projects')
	});

	// Singleton
	Projects.getInstance = _.memoize(function() {
		return new Projects();
	});

	module.exports = Projects;
});
