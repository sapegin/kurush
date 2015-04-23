// Author: Artem Sapegin http://sapegin.me, 2015

import Backbone from 'backbone';
import Dispatcher from '../dispatcher';

export const StateModel = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('State'),

	defaults: {
		editingTaskId: null
	},

	actions: {
		/**
		 * Opens given task in editor.
		 *
		 * @param {String} [params.id] Task ID.
		 */
		setEditingTaskId(params) {
			this.update({editingTaskId: params.id});
		},

		/**
		 * Closes task with opened editor.
		 */
		closeEditingTask() {
			this.update({editingTaskId: null});
		}
	},

	initialize() {
		this.dispatchToken = Dispatcher.registerActions(this.actions, this);
	},

	update() {
		this.set.apply(this, arguments);
		this.save();
	}
});

export default new StateModel({id: 1});
