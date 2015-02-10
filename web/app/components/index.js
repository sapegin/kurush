define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Tasks = require('components/tasks');
	var Task = require('models/task');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		createTask: function() {
			this.props.tasks.create({new: true});
		},

		render: function() {
			return (
				React.createElement("div", null, 
					React.createElement("button", {onClick: this.createTask}, "Create"), 
					React.createElement(Tasks, {collection: this.props.tasks})
				)
			);
		}
	});
});
