// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var _ = require('lodash');
	var Backbone = require('backbone');
	var Project = require('models/project');

	var ProjectsCollection = Backbone.Collection.extend({
		model: Project,
		localStorage: new Backbone.LocalStorage('Projects'),

		getNames: function() {
			return _.pluck(this.toJSON(), 'name');
		}
	});

	var ProjectsStore = new ProjectsCollection();

	module.exports = ProjectsStore;
	module.exports.ProjectsCollection = ProjectsCollection;
});
