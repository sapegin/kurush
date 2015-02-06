define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Tasks = require('components/tasks');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		render: function() {
			return (<Tasks collection={this.props.tasks} />);
		}
	});
});
