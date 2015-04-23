// Author: Artem Sapegin http://sapegin.me, 2015

import Dispatcher from '../dispatcher';
import ProjectsStore from '../stores/ProjectsStore';
import Combobox from './Combobox';
import Select from './Select';

const PT = React.PropTypes;

export default React.createExtendedClass({
	displayName: 'Task',
	propTypes: {
		model: PT.object.isRequired
	},
	mixins: [
		React.AppStateMixin
	],

	isInEditMode() {
		return this.state.editingTaskId === this.get('id');
	},

	handleEdit(id) {
		Dispatcher.actions.setEditingTaskId({id: this.get('id')});
	},

	handleSave(event) {
		event.preventDefault();
		const values = this.getFormData(event.target);
		Dispatcher.actions.updateTask({
			model: this.model(),
			attributes: values
		});
		Dispatcher.actions.closeEditingTask();
	},

	render() {
		if (this.isInEditMode()) {
			return this.renderEdit();
		}
		else {
			return this.renderView();
		}
	},

	renderView() {
		const model = this.model();
		const timeSpent = model.get('minutesSpent');

		return (
			<li>
				{this.get('name')}, {model.getProjectName()}, {model.getStateName()}, {model.get('summ')}, {model.get('rate')}, {timeSpent} hrs
				<button onClick={this.handleEdit} ref="edit">Edit</button>
			</li>
		);
	},

	renderEdit() {
		const model = this.model();
		const states = model.getSatesList();
		const projects = ProjectsStore.getNames();

		return (
			<li>
				<form onSubmit={this.handleSave} ref="form">
					<div>
						<input type="text" defaultValue={model.get('name')} ref="name" name="name" placeholder="Title" tabIndex="1" autoFocus/>
						<Combobox items={projects} value={model.getProjectName()} ref="project" placeholder="Project" name="project" tabIndex="2"/>
						<Select items={states} value={model.get('state')} ref="state" name="state" tabIndex="3"/>
					</div>
					<div>
						<textarea defaultValue={model.get('notes')} ref="notes" placeholder="Notes" name="notes" tabIndex="4"/>
					</div>
					<div>
						<input type="submit" value="Save" tabIndex="5"/>
					</div>
				</form>
			</li>
		);
	}
});
