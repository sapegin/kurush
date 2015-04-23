import Dispatcher from '../dispatcher';
import Tasks from './Tasks';

const PT = React.PropTypes;

export default React.createExtendedClass({
	displayName: 'Index',
	propTypes: {
		tasks: PT.object.isRequired
	},

	createTask() {
		Dispatcher.actions.createTask();
	},

	render() {
		return (
			<div>
				<button onClick={this.createTask} ref="create">Create</button>
				<Tasks collection={this.props.tasks}/>
			</div>
		);
	}
});
