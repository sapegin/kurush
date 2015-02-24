define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Tasks = require('components/tasks');

	/**
	 * @jsx React.DOM
	 */
	module.exports = React.createExtendedClass({
		displayName: 'Index',
		propTypes: {
			tasks: React.PropTypes.object.isRequired,
		},

		createTask: function() {
			this.props.tasks.create({new: true}, {at: 0});
		},

		render: function() {
			return (
				<div>
					<button onClick={this.createTask} ref="create">Create</button>
					<Tasks collection={this.props.tasks}/>
				</div>
			);
		}
	});
});
