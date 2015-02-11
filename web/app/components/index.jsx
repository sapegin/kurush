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
			this.props.tasks.create({new: true}, {at: 0});
		},

		render: function() {
			return (
				<div>
					<button onClick={this.createTask}>Create</button>
					<Tasks collection={this.props.tasks}/>
				</div>
			);
		}
	});
});
