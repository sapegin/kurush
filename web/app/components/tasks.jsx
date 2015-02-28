// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var React = require('react');
	var Task = require('components/task');

	module.exports = React.createExtendedClass({
		displayName: 'Tasks',
		propTypes: {
			collection: React.PropTypes.object.isRequired,
		},

		render: function() {
			var tasks = this.collection().map(function(task) {
				return (
					<Task model={task} key={task.cid}/>
				);
			});

			return (
				<ul>
					{tasks}
				</ul>
			);
		}
	});
});
