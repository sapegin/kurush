define(function(require, exports, module) {
	'use strict';

	var _ = require('underscore');
	var Backbone = require('backbone');
	var Task = require('models/task');

	var Tasks = Backbone.Collection.extend({
		model: Task,
		localStorage: new Backbone.LocalStorage('Tasks')
	});

	// Singleton
	Tasks.getInstance = _.memoize(function() {
		return new Tasks();
	});

	module.exports = Tasks;
});
