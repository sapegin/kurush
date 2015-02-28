define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Dispatcher = require('dispatcher');
	var Tasks = require('components/tasks');

	module.exports = React.createExtendedClass({
		displayName: 'Index',
		propTypes: {
			tasks: React.PropTypes.object.isRequired,
		},

		createTask: function() {
			Dispatcher.actions.createTask();
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
