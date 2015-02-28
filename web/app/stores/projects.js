// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var Backbone = require('backbone');
	var Project = require('models/project');

	var ProjectsCollection = Backbone.Collection.extend({
		model: Project,
		localStorage: new Backbone.LocalStorage('Projects')
	});

	var ProjectsStore = new ProjectsCollection();

	module.exports = ProjectsStore;
	module.exports.ProjectsCollection = ProjectsCollection;
});
