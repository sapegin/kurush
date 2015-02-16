define(function(require, exports, module) {
	'use strict';

	var _ = require('lodash');
	var React = require('react');

	var slice = Array.prototype.slice;

	React.KurushMixin = {
		get: function(field) {
			return this.props.model.get(field);
		},

		getFormData: function(form) {
			var values = {};
			_.each(this.refs, function(ref, name) {
				var node = ref.getDOMNode();
				if (!form.contains(node)) return;
				values[name] = 'value' in node ? node.value : ref.getValue();
			});
			return values;
		},

		getAttrs: function() {
			return _.omit(this.props, _.keys(this.constructor.defaultProps));
		}
	};

	React.createExtendedClass = function(spec) {
		var currentMixins = spec.mixins || [];

		spec.mixins = currentMixins.concat([
			React.KurushMixin
		]);

		return React.createBackboneClass(spec);
	};

});
