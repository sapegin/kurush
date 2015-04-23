// Author: Artem Sapegin http://sapegin.me, 2015

import Task from './Task';

const PT = React.PropTypes;

export default React.createExtendedClass({
	displayName: 'Tasks',
	propTypes: {
		collection: PT.object.isRequired
	},

	render() {
		var tasks = this.collection().map((task) => {
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
