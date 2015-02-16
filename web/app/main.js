require(['app', 'router'], function(app, Router) {
	'use strict';

	app.router = new Router();

	// Trigger the initial route and enable HTML5 History API support, set the root folder.
	Backbone.history.start({pushState: true, root: app.root});
});
