require(['bootstrap', 'router', 'backbone'], function(_, Router, Backbone) {
	'use strict';

	new Router();

	// Trigger the initial route and enable HTML5 History API support, set the root folder
	Backbone.history.start({pushState: true, root: '/'});
});
