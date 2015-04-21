define(function(require, exports, module) {
	'use strict';

	var Backbone = require('backbone');
	var React = require('react');
	var ProjectsStore = require('stores/projects');
	var TasksStore = require('stores/tasks');
	var StateStore = require('stores/state');
	var IndexView = React.createFactory(require('components/index'));

	ProjectsStore.fetch();
	TasksStore.fetch();
	StateStore.fetch();

	module.exports = Backbone.Router.extend({
		routes: {
			'': 'index'
		},

		index: function() {
			renderView(new IndexView({tasks: TasksStore}));
		}
	});

	// Helpers
	var renderView = function (view) {
		var root = document.body;
		React.unmountComponentAtNode(root);
		React.render(view, root);
	};

});
