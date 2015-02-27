// Author: Artem Sapegin http://sapegin.me, 2015

define(function(require, exports, module) {
	'use strict';

	var _ = require('lodash');
	var Dispatcher = require('flux').Dispatcher;

	function AppDispatcher() {
		Dispatcher.call(this);
	}

	AppDispatcher.prototype = _.create(Dispatcher.prototype, {
		constructor: AppDispatcher,
		actions: {},

		registerActions: function(actions, context) {
			for (var action in actions) {
				this.actions[action] = this.dispatchAction.bind(this, action);
			}
			return this.register(function(payload) {
				actions[payload.actionType].call(context, payload);
			});
		},

		dispatchAction: function(action, payload) {
			payload = payload || {};
			payload.actionType = action;
			this.dispatch(payload);
		}
	});

	module.exports = new AppDispatcher();
	module.exports.AppDispatcher = AppDispatcher;

});
