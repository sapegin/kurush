// Author: Artem Sapegin http://sapegin.me, 2015

import Backbone from 'backbone';
import Dispatcher from '../dispatcher';
import TaskModel from '../models/TaskModel';

export const TasksCollection = Backbone.Collection.extend({
	model: TaskModel,
	localStorage: new Backbone.LocalStorage('Tasks'),

	actions: {
		/**
		 * Create a task.
		 */
		createTask() {
			this.create({}, {at: 0});
		},

		/**
		 * Update given task.
		 *
		 * @param {Backbone.Model} params.model Task to update.
		 * @param {Object} params.attributes New values.
		 */
		updateTask(params) {
			const model = params.model;
			model.set(params.attributes, {update: true});
			model.save();
		}
	},

	initialize() {
		this.dispatchToken = Dispatcher.registerActions(this.actions, this);

		const statesOrder = [
			TaskModel.STATE_IN_PROGRESS,
			TaskModel.STATE_NOT_STARTED,
			TaskModel.STATE_NEW,
			TaskModel.STATE_SUSPENDED,
			TaskModel.STATE_UNPAID,
			TaskModel.STATE_CLOSED
		];
		let stateToOrder = {};
		statesOrder.forEach(function(state, order) {
			stateToOrder[state] = order;
		});
		this.stateToOrder = stateToOrder;
	},

	/**
	 * Order:
	 *   - has new attribute: always first
	 *   - is in progress, created, etc.
	 *   - by change date
	 */
	comparator(a, b) {
		const aState = a.get('state');
		const bState = b.get('state');

		// Same state: newest first
		if (aState === bState) {
			if (a.get('changed') > b.get('changed')) {
				return -1;
			}
			return 1;
		}

		// Sort by state
		if (this.stateToOrder[aState] < this.stateToOrder[bState]) {
			return -1;
		}

		return 1;
	}
});

export default new TasksCollection();
