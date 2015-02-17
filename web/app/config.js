// Author: Artem Sapegin http://sapegin.me, 2015

/*global module:true*/
(function() {
	'use strict';

	var config = {
		paths: {
			lodash: '../bower_components/lodash/lodash',
			jquery: '../bower_components/jquery/dist/jquery',
			backbone: '../bower_components/backbone/backbone',
			react: '../bower_components/react/react',
			backboneLocalStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
			reactBackbone: '../bower_components/react.backbone/react.backbone',
			moment: '../bower_components/moment/moment'
		},

		map: {
			'*': {
				underscore: 'lodash'
			}
		},

		deps: [
			// Mixins and plugins
			'backboneLocalStorage',
			'reactBackbone',
			'util/react-extras',
			// App
			'main'
		]
	};

	if (typeof window !== 'undefined') {
		// Set up Require.js in browser
		require.config(config);
	}
	else {
		// Expose config as a Node.js module
		module.exports = config;
	}
}());
