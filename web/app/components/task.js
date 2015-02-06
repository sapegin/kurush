define(function(require, exports, module) {
	'use strict';

	var React = require('react');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		render: function() {
			return (
				React.createElement("li", null, 
					"[", this.get('name'), ", ", this.get('project'), ", ", this.get('client'), "]"
				)
			);
		}
	});
});
