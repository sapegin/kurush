// Author: Artem Sapegin http://sapegin.me, 2015

import _ from 'lodash';
import { Dispatcher } from 'flux';

export function AppDispatcher() {
	Dispatcher.call(this);
}

AppDispatcher.prototype = _.create(Dispatcher.prototype, {
	constructor: AppDispatcher,
	actions: {},

	registerActions(actions, context) {
		for (const action in actions) {
			this.actions[action] = this.dispatchAction.bind(this, action);
		}
		return this.register(function(payload) {
			const func = actions[payload.actionType];
			if (func) {
				func.call(context, payload);
			}
		});
	},

	dispatchAction(action, payload) {
		payload = payload || {};
		payload.actionType = action;
		this.dispatch(payload);
	}
});

export default new AppDispatcher();
