define(function(require, exports, module) {
	'use strict';

	var Backbone = require('backbone');
	var React = require('react');
	var Tasks = require('collections/tasks');
	var IndexView = React.createFactory(require('components/index'));

	Tasks.getInstance().fetch();

	module.exports = Backbone.Router.extend({
		routes: {
			'': 'index'
		},

		index: function() {
			renderView(new IndexView({tasks: Tasks.getInstance()}));
		}
	});

	// Helpers
	var renderView = function (view) {
		var root = document.body;
		React.unmountComponentAtNode(root);
		React.render(view, root);
	};

});
