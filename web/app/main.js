require(['app', 'router', 'react', 'backboneLocalStorage', 'reactBackbone', 'util/react-extras'], function(app, Router, React) {
	'use strict';

	app.router = new Router();

	// Trigger the initial route and enable HTML5 History API support, set the root folder.
	Backbone.history.start({pushState: true, root: app.root});
});
