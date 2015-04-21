define(function(require, exports, module) {
	'use strict';

	var _ = require('lodash');
	var React = require('react');
	var StateStore = require('stores/state');

	React.KurushMixin = {
		get: function(field) {
			return this.props.model.get(field);
		},

		getFormData: function(form) {
			var values = {};
			_.each(this.refs, function(ref, name) {
				var node = ref.getDOMNode();
				if (!node.name || !form.contains(node)) return;
				if ('value' in node) {
					values[name] = node.value;
				}
				else if ('getValue' in ref) {
					values[name] = ref.getValue();
				}
			});
			return values;
		},

		getAttrs: function() {
			return _.omit(this.props, _.keys(this.constructor.defaultProps));
		}
	};

	React.AppStateMixin = {
		getInitialState: function() {
			return this._getStateFromStore();
		},

		componentDidMount: function() {
			StateStore.on('change', this._setStateFromStore);
		},

		componentWillUnmount: function() {
			StateStore.off('change');
		},

		_getStateFromStore: function() {
			return StateStore.toJSON();
		},

		_setStateFromStore: function() {
			if (this.isMounted()) {
				this.setState(this._getStateFromStore());
			}
		}
	};

	React.createExtendedClass = function(spec) {
		var currentMixins = spec.mixins || [];

		spec.mixins = currentMixins.concat([
			React.KurushMixin
		]);

		return React.createBackboneClass(spec);
	};

	module.exports = React;

});
