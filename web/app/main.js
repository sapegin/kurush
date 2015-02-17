require(['app', 'router', 'backbone'], function(app, Router, Backbone) {
	'use strict';

	app.router = new Router();

	// Trigger the initial route and enable HTML5 History API support, set the root folder.
	Backbone.history.start({pushState: true, root: app.root});
});
